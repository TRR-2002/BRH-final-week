# Gemini AI Setup Guide

The BRACU Placement Hub uses **Google Gemini 2.0 Flash** to provide semantic student search and intelligent candidate ranking. To enable this feature, you need to configure a free Gemini API key.

## 1. Get your Gemini API Key
1. Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google Account.
3. Click on **"Create API key"**.
4. Copy your new API key.

## 2. Configure the Backend
1. Open the `.env` file in the `bracu-placement-hub-backend` directory.
2. Locate the line:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Replace `your_gemini_api_key_here` with your actual API key.
4. Save the file.

## 3. Restart the Server
1. Stop the backend server if it's running (Ctrl+C).
2. Start it again using `npm run dev` or `node server.js`.
3. You should see "MongoDB connected successfully!" and no more configuration warnings in the console.

## Why use AI search?
- Matches "Frontend" to students who know "React", "Vue", or "HTML/CSS".
- Provides an **AI Insight** explaining why a student is a good fit.
- Automatically ranks the top 20 most relevant candidates for any query.
