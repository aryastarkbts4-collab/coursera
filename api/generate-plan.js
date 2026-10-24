import generate from '../lib/gemini.mjs';

// Vercel parses JSON request bodies; adapt to the shared Web Request handler.
export default async function handler(req, res) {
  try {
    const method = req.method || 'GET';
    const options = { method };
    if (method !== 'GET' && method !== 'HEAD') {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? null);
    }
    const result = await generate(new Request('https://studypilot.local/api/generate-plan', options));
    result.headers.forEach((value, name) => res.setHeader(name, value));
    res.statusCode = result.status;
    res.end(await result.text());
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'The AI server could not process this request. Check the Vercel function logs.' }));
  }
}
