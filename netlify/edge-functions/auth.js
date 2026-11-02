// Preview lock for the ITCC site: HTTP Basic Auth (browser shows a username + password prompt).
// Credentials live in Netlify environment variables, never in the repo:
//   SITE_USER      - the username
//   SITE_PASSWORD  - the password
// To REMOVE the lock later: delete this file (or delete the two variables - the site then
// refuses to open, so delete the file when the client is approved).

const encoder = new TextEncoder();

// Compare in constant time so the check does not leak how many characters matched.
async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

function challenge() {
  return new Response(
    "ITCC website preview - pending approval. Please enter the username and password supplied by Click 4 Tech Solutions.",
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="ITCC Website Preview", charset="UTF-8"',
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}

export default async (request, context) => {
  const user = Netlify.env.get("SITE_USER");
  const pass = Netlify.env.get("SITE_PASSWORD");

  // Fail closed: if the variables are missing, nobody gets in.
  if (!user || !pass) {
    return new Response("Preview is locked (credentials not configured).", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return challenge();

  let decoded = "";
  try {
    decoded = new TextDecoder().decode(
      Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))
    );
  } catch (_) {
    return challenge();
  }

  const sep = decoded.indexOf(":");
  if (sep < 0) return challenge();

  const okUser = await safeEqual(decoded.slice(0, sep), user);
  const okPass = await safeEqual(decoded.slice(sep + 1), pass);
  if (!(okUser && okPass)) return challenge();

  return context.next();
};

export const config = { path: "/*" };
