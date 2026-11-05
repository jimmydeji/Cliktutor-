import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

dotenv.config();
initializeApp();
const adminDb = getFirestore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Email Notification endpoint
import nodemailer from 'nodemailer';
app.post('/api/send-email', async (req, res) => {
  console.log('Received request to /api/send-email');
  try {
    const { to, subject, text, html } = req.body;
    console.log('Email data:', { to, subject });
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP configuration is missing. Email sending skipped.');
      return res.status(503).json({ error: 'Email service is not configured.' });
    }
    
    // NOTE: This uses a placeholder transport. Configure with real SMTP details.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Sending email...');
    await transporter.sendMail({
      from: '"EasyBook Team" <noreply@easybookapp.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully!');
    res.json({ message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('Error in /api/send-email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});


// Initialize Google Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Academic Tutor Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, studentContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please ensure GEMINI_API_KEY is provided.',
      });
    }

    const studentInfo = studentContext
      ? `Student Profile:
- Name: ${studentContext.name || 'Student'}
- Class: ${studentContext.grade || 'SS2'} Science
- School: ${studentContext.schoolName || 'Secondary School'} (${studentContext.lga || ''}, ${studentContext.state || 'Nigeria'})
- Current Subject Focus: ${studentContext.currentSubject || 'General Science'}
- Recent Topic Weaknesses: ${(studentContext.weaknesses || []).join(', ') || 'None noted yet'}`
      : 'Target Audience: Nigerian Senior Secondary School Science student (SS1-SS3).';

    const systemInstruction = `You are "EasyTutor", an expert, encouraging, and highly knowledgeable Nigerian Senior Secondary School Science Academic AI Tutor inside the "EasyBook" app.
Your mission is to help SS1, SS2, and SS3 Nigerian students master Mathematics, English Language, Physics, Chemistry, and Biology for their termly school examinations and national examinations (WAEC WASSCE, JAMB UTME, and NECO).

Guidelines:
1. Follow the Nigerian NERDC Senior Secondary National Curriculum standards strictly.
2. Provide step-by-step working for mathematical and physics calculations with formulas clearly formatted.
3. For Chemistry, balance chemical equations and explain mechanisms/stoichiometry clearly.
4. For Biology, explain physiological diagrams, botanical/zoological classifications, and genetics with clarity.
5. For English Language, explain lexis and structure, concord, antonyms/synonyms, oral English (stress & phonetics), and comprehension skills.
6. Adopt an encouraging, respectful, motivational Nigerian teacher persona (friendly, sharp, using terms like "Future Scholar", "Great effort!", "Let's crack this WAEC/JAMB question").
7. When diagnosing mistakes, gently point out why a specific distractor was chosen and give a quick tip or mnemonic to never fail it again.
8. Keep answers clear, beautifully structured with bullet points or numbered steps, avoiding excessively verbose essays unless requested.

${studentInfo}`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate an answer right now. Please try again.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: error.message || 'Failed to process AI tutor request',
    });
  }
});

// 2. Question Explanation & Step-by-Step Breakdown endpoint
app.post('/api/ai/explain-question', async (req, res) => {
  try {
    const { question, selectedOption, correctOption, subject, topic, examType, grade } = req.body;

    if (!question || !correctOption) {
      return res.status(400).json({ error: 'Question and correctOption are required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured.',
      });
    }

    const prompt = `You are EasyTutor for Nigerian Senior Secondary School students (${grade || 'SS1-SS3'}).
Subject: ${subject}
Topic: ${topic || 'General Curriculum'}
Exam Standard: ${examType || 'WAEC / JAMB / NECO'}

Question:
"${question}"

The student selected: "${selectedOption || 'None / Skipped'}"
The correct option is: "${correctOption}"

Please provide:
1. **Direct Answer & Verdict**: State the correct answer clearly.
2. **Step-by-Step Breakdown / Proof**: Show the mathematical, chemical, biological, or grammatical principle used to derive the answer.
3. **Distractor Analysis**: Why is the student's selected answer incorrect (if incorrect) or why do students commonly fall for the wrong options?
4. **Curriculum Master Tip**: A short formula, mnemonic, or exam tip specifically for WAEC/JAMB/NECO.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/explain-question:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate explanation',
    });
  }
});

// 3. Weakness Analysis & Targeted Study Recommendations
app.post('/api/ai/analyze-weakness', async (req, res) => {
  try {
    const { studentName, grade, subjectStats, recentMissedQuestions } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured.',
      });
    }

    const prompt = `Analyze this Nigerian Senior Secondary (${grade || 'SS2'}) Science Student's performance and provide a targeted study plan and weakness breakdown:
Student Name: ${studentName || 'Student'}
Class: ${grade || 'SS2'}
Subject Performance Breakdown:
${JSON.stringify(subjectStats || {}, null, 2)}

Sample Recent Missed Questions / Low Score Topics:
${JSON.stringify(recentMissedQuestions || [], null, 2)}

Please provide:
1. **Diagnostic Summary**: Key conceptual gaps identified across 1st, 2nd, and 3rd term topics.
2. **Top 3 High-Yield Topics to Revise Now**: Topics with frequent appearances in WAEC WASSCE and JAMB UTME that need immediate attention.
3. **Targeted Study Strategy**: Exact steps for the student to improve their accuracy over the next 14 days.
4. **Encouraging Word**: An authentic, motivating closing statement.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-weakness:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze weaknesses',
    });
  }
});

// 4. AI Exam Question Search & Solve
app.post('/api/ai/search-questions', async (req, res) => {
  try {
    const { subject, query } = req.body;
    if (!subject || !query) {
      return res.status(400).json({ error: 'Subject and query are required.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured.' });
    }

    const prompt = `Act as an expert Nigerian exam tutor. Find or generate authentic questions for ${subject} based on the request: "${query}".
    Provide the question, multiple choice options (A, B, C, D), correct answer, and a step-by-step explanation. Ensure it matches the NERDC/JAMB/WAEC standard.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { temperature: 0.5 },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/search-questions:', error);
    res.status(500).json({ error: 'Failed to search for questions.' });
  }
});

// 5. Activation endpoint
app.post('/api/activate', async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and code are required.' });
    }

    const userDocRef = adminDb.collection('studentProfile').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userData = userDoc.data();
    const storedHash = userData?.activationCodeHash;

    if (!storedHash) {
      return res.status(400).json({ error: 'Activation not initiated for this user.' });
    }

    const providedHash = crypto.createHash('sha256').update(code).digest('hex');

    if (providedHash !== storedHash) {
      return res.status(401).json({ error: 'Invalid activation code.' });
    }

    await userDocRef.update({ isActivated: true });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in /api/activate:', error);
    res.status(500).json({ error: 'Failed to activate account.' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite or Static file serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EasyBook server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
