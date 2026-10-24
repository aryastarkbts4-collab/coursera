STUDYPILOT - VERCEL VERSION

Your previous project called a Netlify-only URL while hosted on Vercel.
This version calls /api/generate-plan and includes a Vercel server function.

1. Extract the ZIP. Copy EVERYTHING INSIDE StudyPilot-Vercel into your
   existing GitHub project folder. Keep index.html, api/, lib/, package.json
   and vercel.json together at the project root. Commit and push.
2. Vercel project > Settings > Build and Deployment:
   Framework Preset: Other. No build command needed; Output Directory: .
   Root Directory: the folder containing index.html, api/ and vercel.json.
   Remove old custom catch-all rewrites that send /api/* to index.html.
3. Vercel project > Settings > Environment Variables:
   Add GEMINI_API_KEY with your Google AI Studio API key.
   Enable Production (and Preview if you use preview deployments).
   GEMINI_MODEL is optional; set it only to a model your account can use.
   Do not put the key in index.html or GitHub.
4. Deployments > Redeploy the latest deployment after saving variables.
5. Open https://YOUR-SITE.vercel.app/api/generate-plan
   JSON with configured:true means the server exists and has a key.
   It does NOT prove that Google accepts the key or has available quota.
6. Open Explain, enter 'What is an array?', and generate a short answer.
   If it fails, share the displayed error, not your key.

Login and database code are unchanged.
AI cannot work by double-clicking index.html; use the deployed site.
