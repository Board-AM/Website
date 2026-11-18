/**
 * boardam.com — Cloudflare Worker
 *
 * Serves the static site from ./dist and handles one API route:
 *   POST /api/contact  →  emails the message to CONTACT_TO via Cloudflare Email Service.
 *
 * Bindings / config (see wrangler.jsonc):
 *   ASSETS            static assets binding (the built site)
 *   EMAIL             send_email binding, locked to CONTACT_TO
 *   CONTACT_TO        var    inbox that receives messages (info@boardam.com)
 *   CONTACT_FROM      var    sender address on an Email-Routing-enabled (sub)domain
 *   TURNSTILE_SECRET  secret optional; when set, every submission must pass Turnstile
 */

const LIMITS = { name: 120, email: 254, subject: 200, message: 5000 };
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405, { Allow: 'POST' });
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  // Same-origin only: the form posts from the site itself.
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: 'Forbidden' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return json({ ok: true });
  }

  const f = {};
  for (const k of Object.keys(LIMITS)) {
    f[k] = typeof body[k] === 'string' ? body[k].trim() : '';
    if (!f[k]) return json({ ok: false, error: 'Please fill in every field.' }, 400);
    if (f[k].length > LIMITS[k]) return json({ ok: false, error: `The ${k} is too long.` }, 400);
  }
  if (!EMAIL_RE.test(f.email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  // Header-injection guard for fields that end up in email headers.
  if (/[\r\n]/.test(f.name + f.email + f.subject)) return json({ ok: false, error: 'Invalid characters.' }, 400);

  if (env.TURNSTILE_SECRET) {
    const passed = await verifyTurnstile(body.turnstile, env.TURNSTILE_SECRET, request.headers.get('CF-Connecting-IP'));
    if (!passed) return json({ ok: false, error: 'Spam check failed. Please try again.' }, 400);
  }

  const text = [
    `Name:    ${f.name}`,
    `Email:   ${f.email}`,
    `Subject: ${f.subject}`,
    '',
    f.message,
    '',
    '—',
    `Sent from the contact form on ${new URL(request.url).host}`,
  ].join('\n');

  try {
    await env.EMAIL.send({
      from: { email: env.CONTACT_FROM, name: 'boardam.com contact form' },
      to: env.CONTACT_TO,
      replyTo: { email: f.email, name: f.name },
      subject: `[boardam.com] ${f.subject}`,
      text,
    });
  } catch (err) {
    console.error('contact send failed', err && (err.code || err.message || err));
    return json({ ok: false, error: 'We could not send your message. Please email info@boardam.com directly.' }, 502);
  }

  return json({ ok: true });
}

async function verifyTurnstile(token, secret, ip) {
  if (typeof token !== 'string' || !token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = await r.json();
    return data.success === true;
  } catch {
    return false;
  }
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}
