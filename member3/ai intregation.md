12/30/25, 12:58 AM
Gemini 1.5 Flash Integration Guide

🚀 Google Gemini 1.5 Flash Integration Guide

Complete implementation guide for AI-powered Campus Recruitment Platform

Date: December 30, 2025 | Model: Gemini 1.5 Flash

📋 Document Overview

This guide covers everything you need to integrate Google Gemini 1.5 Flash API for:

✓ Talent Sourcing & AI-Powered Search
✓ Content Moderation & Flagging System
✓ Complete code examples and best practices

1. Why Gemini 1.5 Flash?

✨ Key Features

✓ Completely Free: 1,500 requests/day (no credit card required)
✓ Fast & Smart: Optimized for speed while maintaining quality
✓ Easy Integration: Simple REST API, similar to OpenAI
✓ No Training Needed: Pre-trained on skills, content moderation, semantic understanding
✓ Multi-Purpose: Handles both talent matching and content moderation

Comparison with Alternatives

API	Free Tier	Ease of Use	Best For
Gemini 1.5 Flash	1,500/day forever	★★★★★	Your exact use case
DeepSeek	Credits then cheap	★★★★☆	If you scale later
OpenAI	$5 credit trial	★★★★★	Paid usage
Cohere	1,000/month	★★★★☆	Pure embeddings
2. Getting Started - Setup Steps
Step 1: Get Your API Key

Go to https://aistudio.google.com/

Sign in with your Google account

Click "Get API Key"

Create a new API key (takes 10 seconds)

Copy and save your API key securely

⚠️ Security Note: Never expose your API key in client-side code. Always store it in environment variables or backend configuration.

Step 2: Environment Setup

Create a .env file in your project root:

code
Code
download
content_copy
expand_less
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1
Step 3: Install Dependencies (Optional)

For Node.js/Express backend:

code
Bash
download
content_copy
expand_less
npm install node-fetch dotenv

No additional libraries needed - uses standard fetch API!

3. Use Case 1: Talent Sourcing & AI Search
How It Works

Gemini understands skills semantically without any training:

Search "React" → matches: ReactJS, React.js, Frontend Development, Component-based UI

Search "Python" → matches: Django, Flask, FastAPI, Machine Learning, Data Science

Search "Machine Learning" → matches: TensorFlow, PyTorch, Deep Learning, AI, Neural Networks

Implementation Code
code
JavaScript
download
content_copy
expand_less
// Backend API endpoint (Node.js/Express example)
const express = require('express');
const router = express.Router();

// Search students by skills
router.post('/api/search-students', async (req, res) => {
    const { searchQuery, filters } = req.body;

    // Get all student profiles from database
    const students = await db.students.findAll({
        where: filters,
        include: ['skills', 'projects', 'experiences']
    });

    // Use Gemini to rank students
    const rankedStudents = await rankStudentsWithGemini(
        searchQuery,
        students
    );

    res.json(rankedStudents);
});

// Gemini ranking function
async function rankStudentsWithGemini(query, students) {
    const prompt = `You are an AI recruitment assistant.

Job Requirements: "${query}"

Student Profiles:
${students.map((s, i) => `[${i}] ${s.name}
- Skills: ${s.skills.join(', ')}
- Experience: ${s.experiences.map(e => e.title).join(', ')}
- Projects: ${s.projects.map(p => p.name).join(', ')}`).join('\n')}

Task: Rank the top 10 students that best match the requirements.

Return ONLY a JSON array:
[
    {
        "studentIndex": 0,
        "matchScore": 95,
        "matchReason": "Strong React and Node.js experience...",
        "strengths": ["3 years React", "Built scalable apps"]
    }
];`

    const response = await fetch(
        `${process.env.GEMINI_API_URL}/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    // Parse JSON from response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    const rankings = JSON.parse(jsonMatch[0]);

    // Merge with original student data
    return rankings.map(rank => ({
        ...students[rank.studentIndex],
        matchScore: rank.matchScore,
        matchReason: rank.matchReason,
        strengths: rank.strengths
    }));
}

module.exports = router;
4. Use Case 2: Content Moderation System
What It Does

✓ Automatically flags inappropriate content
✓ Detects: profanity, hate speech, harassment, spam, negative reviews
✓ Provides severity levels (low/medium/high)
✓ Suggests actions (warn/delete/suspend)
✓ Explains reasoning for admin review

Implementation Code
code
JavaScript
download
content_copy
expand_less
// Content moderation function
async function moderateContent(postText, userName, postType) {
    const prompt = `You are a content moderator for a campus recruitment platform.

Post Type: ${postType}
Author: ${userName}
Content: "${postText}"

Analyze for:
- Inappropriate language (profanity, slurs)
- Hate speech or discrimination
- Harassment or personal attacks
- Spam or promotional content
- Negative/toxic sentiment in reviews

Return ONLY this JSON:
{
    "isFlagged": true/false,
    "category": "appropriate/profanity/hate-speech/harassment/spam/negative-review",
    "severity": "low/medium/high",
    "reason": "Brief explanation",
    "suggestedAction": "none/warn/delete/suspend",
    "confidence": 0-100
}`;

    const response = await fetch(
        `${process.env.GEMINI_API_URL}/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
}

// Use in post creation endpoint
router.post('/api/posts', async (req, res) => {
    const { content, userId } = req.body;
    const post = await db.posts.create({ content, userId, status: 'active' });

    // Moderate content with AI
    const moderation = await moderateContent(content, req.user.name, 'post');

    if (moderation.isFlagged) {
        await db.flaggedContent.create({
            postId: post.id,
            category: moderation.category,
            severity: moderation.severity,
            reason: moderation.reason,
            suggestedAction: moderation.suggestedAction,
            status: 'pending_review'
        });

        if (moderation.severity === 'high') {
            await post.update({ status: 'hidden_pending_review' });
        }
    }
    res.json({ success: true, moderation });
});
5. Best Practices & Optimization
Rate Limiting & Caching
code
JavaScript
download
content_copy
expand_less
// Cache common searches
const searchCache = new Map();

async function cachedSearch(query, students) {
    const cacheKey = `${query}_${students.length}`;

    if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
    }

    const results = await rankStudentsWithGemini(query, students);
    searchCache.set(cacheKey, results);

    // Clear cache after 1 hour
    setTimeout(() => searchCache.delete(cacheKey), 3600000);

    return results;
}
Error Handling
code
JavaScript
download
content_copy
expand_less
async function safeGeminiCall(prompt) {
    try {
        const response = await fetch(geminiUrl, config);
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0]) {
            throw new Error('Invalid response');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return fallbackSearch(prompt);
    }
}
6. Security Checklist

⚠️ Important Security Measures

✓ Never expose API key in frontend code
✓ Store API key in environment variables
✓ Validate and sanitize all user inputs
✓ Implement rate limiting on your endpoints
✓ Log all AI decisions for audit trail
✓ Always have human review for critical actions
✓ Don't send sensitive personal data to AI

7. Summary & Quick Reference
✅ What You Learned

✓ API: Google Gemini 1.5 Flash
✓ Cost: Free - 1,500 requests/day
✓ Use Case 1: AI-powered talent search
✓ Use Case 2: Automatic content moderation
✓ Integration: Simple REST API with fetch
✓ Setup Time: ~15 minutes

Quick Start Checklist

□ Get API key from https://aistudio.google.com/
□ Add to .env file: GEMINI_API_KEY=your_key
□ Copy talent search code to backend
□ Copy content moderation code
□ Create admin dashboard endpoint
□ Test with sample data
□ Deploy and monitor usage
□ Set up error logging
□ Implement caching
□ Done! 🎉

API Endpoint Reference

POST https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_KEY

Body:

code
JSON
download
content_copy
expand_less
{
    "contents": [{
        "parts": [{"text": "Your prompt here"}]
    }]
}

Response:

code
JSON
download
content_copy
expand_less
{
    "candidates": [{
        "content": {
            "parts": [{"text": "AI response"}]
        }
    }]
}
Need Help?

Official Docs: https://ai.google.dev/gemini-api/docs

API Studio: https://aistudio.google.com/

Rate Limits: 1,500 requests/day (free)

Document created: December 30, 2025

Campus Recruitment Platform - AI Integration Guide

© 2025 - Gemini 1.5 Flash Implementation