# 🚀 Full Stack Deployment Guide (Vercel)

This guide explains how to deploy the **BRACU Placement Hub** (Backend + Frontend) entirely on Vercel.

---

## 🛠️ Step 1: Backend Preparation (IMPORTANT)
Since Vercel uses Serverless Functions, your traditional `server.js` needs two small tweaks. **Note: I have not modified your actual files yet as per your instruction.**

### A. Modify `bracu-placement-hub-backend/server.js`
At the very end of the file, replace your current `app.listen(...)` block with this:

```javascript
// Export for Vercel
module.exports = app;

const PORT = process.env.PORT || 1350;

// Only listen if NOT in production (local testing)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
```

### B. Create `bracu-placement-hub-backend/vercel.json`
Create a new file in the backend folder with this content:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

---

## 🌍 Step 2: Deploy the Backend
1. Go to **Vercel Dashboard** → **New Project**.
2. Select your repository.
3. **Project Name**: `brh-backend`.
4. **Root Directory**: Select `bracu-placement-hub-backend`.
5. **Environment Variables**: Add all variables from your `.env` (MONGO_URI, JWT_SECRET, GEMINI_API_KEY, etc.).
6. Click **Deploy**.
7. **Copy the result URL** (e.g., `https://brh-backend.vercel.app`).

---

## 💻 Step 3: Deploy the Frontend
1. Go to **Vercel Dashboard** → **New Project**.
2. Select the same repository.
3. **Project Name**: `brh-frontend`.
4. **Root Directory**: Select `bracu-placement-hub-frontend`.
5. **Framework Preset**: Select **Vite**.
6. **Environment Variables**:
   - Add **`VITE_API_URL`**
   - **Value**: The Backend URL you copied in Step 2.
7. Click **Deploy**.

---

## 🎓 User Learnings Summary

1. **Serverless vs Monolith**: In Vercel, your backend doesn't "stay on." It wakes up when a request comes in. This is why we export `app` instead of just running it.
2. **Environment Variables**: Local `.env` files are ignored. You must use the Vercel Dashboard UI for secret keys.
3. **Branch-Specific Deployment**: You can set Vercel to only redeploy when you push to the `tushit1350` branch via **Settings → Git**.
4. **CORS**: Since your frontend and backend will be on different Vercel domains, the backend `server.js` must allow the frontend's Vercel URL in its CORS configuration.

---

## ✅ Deployment Checklist
- [ ] Backend `server.js` has `module.exports = app`.
- [ ] Backend has `vercel.json`.
- [ ] `MONGO_URI` is added to Vercel Backend variables.
- [ ] `VITE_API_URL` is added to Vercel Frontend variables.
- [ ] Deployment branch is set to `tushit1350`.

**Good luck with your submission!** 🎯
