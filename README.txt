STUDYPILOT SIMPLE - no Node.js, no .env file

1. TRY IT NOW: double-click index.html. Everything works in the browser
   (subjects, offline smart plan, checklist, progress). Data saves in the browser.

2. SUPABASE (login + cloud save) - already connected in index.html
   - Table and privacy rules: see supabase-setup.sql (already applied).
   - In the Supabase dashboard add your Netlify address under
     Authentication > URL Configuration (Site URL + Redirect URLs).
   - Google login: Authentication > Providers > Google (needs a Google client ID and secret).

3. NETLIFY + AI PLANS
   - Put this folder in a GitHub repository, then Netlify > Add new site > Import from Git.
     (Do NOT drag-and-drop: functions are not reliably deployed that way.)
   - Site configuration > Environment variables: add GEMINI_API_KEY (key from aistudio.google.com/apikey).
     Optional: GEMINI_MODEL if the default model name is not available for your account.
   - Redeploy. The "Generate my plan" button now uses AI.
     If AI fails, the site falls back to the offline plan automatically.

Never paste the Gemini key into index.html. Before public use, add sign-in checks
and rate limits to the function. Describe honestly which parts you wrote and which were AI-assisted.

AI TROUBLESHOOTING (updated)
All AI tools share /.netlify/functions/generate-plan.
After deploying the whole project, open that path on your Netlify domain.
- A JSON message says whether the function exists and the key is configured.
  Configured does not prove that Google accepts the key or has quota.
- A 404 or HTML page means the server function is missing from the deployment.
- Add GEMINI_API_KEY with Functions scope in Netlify, then redeploy.
- GEMINI_MODEL is optional; use a model enabled in your AI Studio project.
Generate a short explanation (for example: What is an array?) to test real access.
Errors now identify missing deployment, missing key, quota, model, empty output,
and timeouts. Send the displayed error and your site URL for further diagnosis.
Never send your API key. The key must remain on the server.
The planner has a clearly labelled offline fallback; Explain, Quiz, Compare,
and Pattern Studio require a working Gemini connection.
