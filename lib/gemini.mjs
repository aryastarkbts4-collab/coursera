// The Gemini key is read only on the server. Never put it in index.html.
const reply = (status, obj) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});
export default async (req) => {
  const key = process.env.GEMINI_API_KEY?.trim();
  const model = (process.env.GEMINI_MODEL?.trim() || 'gemini-flash-latest').replace(/^models\//, '');
  if (req.method === 'GET') return reply(key ? 200 : 503, {
    configured: !!key, model,
    message: key ? 'Function deployed and key configured. Generate something to test Gemini access.' : 'Add GEMINI_API_KEY in Vercel environment variables for this deployment, then redeploy.'
  });
  if (req.method !== 'POST') return reply(405, { error: 'Use POST to generate.' });
  if (!key) return reply(503, { error: 'GEMINI_API_KEY is missing. Add it in Vercel environment variables for this deployment, then redeploy.' });
  let body;
  try { body = await req.json(); } catch { return reply(400, { error: 'Invalid request JSON.' }); }
  if (!body || typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > 20000)
    return reply(400, { error: 'Enter a prompt between 1 and 20,000 characters. For a long chat, press Reset and start again.' });
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: body.prompt }] }],
        generationConfig: body.mode === 'text' ? {} : { responseMimeType: 'application/json' } }),
      signal: AbortSignal.timeout(45000)
    });
    const j = await r.json();
    if (!r.ok) {
      // Include Google's reason, but redact the configured credential if echoed.
      const detail = String(j.error?.message || j.error?.status || 'Request rejected').split(key).join('[redacted]').slice(0, 1500);
      const help = r.status === 429 ? 'Gemini quota or rate limit reached. Check AI Studio usage; retry after the limit resets.'
        : r.status === 404 ? 'This Gemini model is unavailable. Set GEMINI_MODEL to a model enabled for your account, then redeploy.'
        : r.status === 400 || r.status === 401 || r.status === 403 ? 'Check the AI Studio API key, project access and restrictions, then update Vercel and redeploy if needed.'
        : 'Gemini is temporarily unavailable. Try again shortly.';
      return reply(r.status, { error: `${help} Google (${r.status}): ${detail}`, code: j.error?.status || 'GEMINI_ERROR' });
    }
    const candidate = j.candidates?.[0];
    const text = candidate?.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('').trim();
    if (candidate?.finishReason === 'MAX_TOKENS') return reply(502, { error: 'Gemini ran out of output space. Request fewer days or questions, or shorten the topic.' });
    if (!text) return reply(502, { error: 'Gemini returned no answer. Reason: ' + (j.promptFeedback?.blockReason || candidate?.finishReason || 'empty response') + '. Try a shorter, clearer study topic.' });
    return reply(200, { text });
  } catch (e) {
    return reply(502, { error: e.name === 'TimeoutError' || e.name === 'AbortError'
      ? 'Gemini took longer than 45 seconds. Try a shorter request or fewer questions.'
      : 'The server could not read a Gemini response. Try again shortly.' });
  }
};
