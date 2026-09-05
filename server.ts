import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function stripMarkdownAsterisks(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\*/g, '')
    .trim();
}

const SINDH_GOVT_SYSTEM_INSTRUCTION = `You are the personal Sindh Government Administrative Assistant for teachers (PST, JEST, ECT, HST, HM, SS) and education department employees.

CRITICAL INSTRUCTION - ANSWER USER QUERIES DIRECTLY:
1. Directly and clearly answer the user's specific query, question, or scenario first. DO NOT lecture the user by regurgitating rule names, statute titles, or generic lists of rules.
2. Speak directly to the user in a helpful, conversational, and authoritative tone (e.g., "To resolve this with your DAO...", "In your case, you are eligible for...", "Here is the exact step-by-step procedure you should follow:").
3. Give practical, actionable solutions for what the user should do with their DDO, TEO, DEO, or District Accounts Office (DAO).
4. If the user asks for a letter, justification, or proforma text, provide the draft ready to copy and print.
5. MANDATORY PLAIN TEXT RULE: DO NOT use any asterisks (*) or markdown formatting (like ** or *) anywhere in your output. All text must be 100% clean plain text ready for direct official printing and manual editing on government proformas.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Sindh Govt Automation Hub Server' });
  });

  // AI Assistant Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, context, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback intelligent offline response if API key is not configured
        return res.json({
          reply: stripMarkdownAsterisks(generateLocalKnowledgeResponse(message, context)),
          isFallback: true,
        });
      }

      let prompt = message;
      if (context) {
        prompt = `[User Context: Employee designation=${context.designation || 'Teacher'}, BPS=${context.bps || '14'}, Region=${context.region || 'Sindh'}]\n\nUser Question: ${message}\n\nPlease respond in clean plain text with no asterisks (*).`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SINDH_GOVT_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const cleanReply = stripMarkdownAsterisks(response.text || 'Unable to generate response from AI service.');

      res.json({
        reply: cleanReply,
        isFallback: false,
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      // Seamlessly fallback so user experience is never blocked
      const fallbackReply = generateLocalKnowledgeResponse(req.body.message || '', req.body.context);
      res.json({
        reply: stripMarkdownAsterisks(fallbackReply),
        isFallback: true,
      });
    }
  });

  // AI Document Drafting Endpoint
  app.post('/api/ai/draft', async (req, res) => {
    try {
      const { documentType, purpose, employeeData, customNotes } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          draft: stripMarkdownAsterisks(generateLocalDraft(documentType, purpose, employeeData, customNotes)),
          isFallback: true,
        });
      }

      const prompt = `Please draft an official Government of Sindh document body based on the following specifics:
Document Type: ${documentType || 'Official Letter'}
Purpose / Reason: ${purpose || 'Administrative Request'}
Employee: ${employeeData?.name || 'Employee'}, ${employeeData?.designation || 'PST'} (BPS-${employeeData?.bps || 14}), School: ${employeeData?.schoolName || 'Govt School'}, District: ${employeeData?.district || 'District'}
Additional Specifics / Notes: ${customNotes || 'Standard official compliance'}

Draft a formal, concise, and respectful body paragraph text ready to be inserted into the official Sindh Government proforma. Return only plain text without any asterisks (* or **).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SINDH_GOVT_SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });

      const rawDraft = response.text || generateLocalDraft(documentType, purpose, employeeData, customNotes);

      res.json({
        draft: stripMarkdownAsterisks(rawDraft),
        isFallback: false,
      });
    } catch (error: any) {
      console.error('Gemini Draft Error:', error);
      res.json({
        draft: stripMarkdownAsterisks(generateLocalDraft(req.body.documentType, req.body.purpose, req.body.employeeData, req.body.customNotes)),
        isFallback: true,
      });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sindh Govt Automation Server running on http://0.0.0.0:${PORT}`);
  });
}

// Built-in intelligent assistant engine that directly answers user queries
function generateLocalKnowledgeResponse(query: string, context: any): string {
  const q = query.toLowerCase();
  const employeeRole = context?.designation || 'teacher/civil servant';

  if (q.includes('leave') || q.includes('earned leave') || q.includes('casual') || q.includes('ex-pakistan') || q.includes('chutti')) {
    return `To apply for or resolve leave as a ${employeeRole} in Sindh School Education:

1. Casual Leave: You can avail up to 15 to 20 days per calendar year. Submit a short application directly to your Headmaster or TEO, who has sanctioning authority.
2. Earned Leave: Non-vacation staff earn 4 days per month of duty, and teaching/vacation staff earn 1 day per month for official duty performed during vacations.
3. Ex-Pakistan Leave: Route your application through your DDO and TEO to the Competent Authority (Director School Education for BPS-16 and below; Secretary SE&LD for BPS-17 and above). Attach a non-involvement certificate and valid passport copy.
4. Maternity Leave: Entitled up to 90 days on full pay (up to 3 times in entire service).
5. Medical Leave: Submit an application supported by a Medical Fitness Certificate from the Civil Surgeon or Medical Superintendent.

You can compose and print your formal Leave Application directly from the Official Formats & NOC tab in this portal.`;
  }

  if (q.includes('pension') || q.includes('commutation') || q.includes('retirement') || q.includes('lpr') || q.includes('retire')) {
    return `Here is the exact guidance for your pension and retirement processing:

1. Eligibility: You become eligible for voluntary retirement after 25 years of qualifying service, or for superannuation retirement at 60 years of age.
2. Lump-Sum 35% Commutation: Under Sindh rules, you are entitled to commute 35% of your Gross Pension as an immediate lump sum. The amount is calculated using the official age multiplier from the Sindh Finance Department.
3. Monthly Pension: You receive the remaining 65% of your gross pension every month, plus medical allowance and all notified ad-hoc relief pension increases.
4. LPR Encashment: You can claim up to 365 days of basic pay encashment in lieu of Leave Preparatory to Retirement.
5. Action to take now: Open the "Pension Papers (Form-1)" tab above. Enter your retirement date and basic pay, and click "Download All Pension Papers" to download your complete 4-page official pension dossier (Calculation Sheet, Form 1, Sanction Order, and LPR Encashment) ready for DAO submission.`;
  }

  if (q.includes('noc') || q.includes('passport') || q.includes('higher education') || q.includes('exam') || q.includes('study')) {
    return `Here is how you can obtain your No Objection Certificate (NOC) without delays:

1. For Machine-Readable Passport: Prepare your application through your Headmaster/DDO, addressing the District Education Officer (DEO). Attach attested copies of your appointment order, CNIC, first page of your service book, and a statement confirming no disciplinary inquiry or audit recovery is pending.
2. For Higher Studies / B.Ed / M.Ed: If studying in morning shifts, you must seek formal study leave; if evening/weekend classes, obtain permission ensuring school duty hours are not impacted.
3. For SPSC / FPSC Competitive Exams: Apply through proper channel. Your departmental forwarding letter from the DEO is mandatory.
4. Action to take: You can generate and print your official NOC proforma and covering letter directly from the "Official Formats & NOC" tab.`;
  }

  if (q.includes('difference') || q.includes('arrears') || q.includes('tr-22') || q.includes('dao') || q.includes('bill') || q.includes('rejected') || q.includes('objection')) {
    return `To clear your salary arrears or difference bill through your District Accounts Office (DAO):

1. Key Documents Required:
   - Form TR-22 (Obverse billing form) signed and sealed by your DDO.
   - TR-22 Schedule (Reverse) showing month-by-month basic pay, allowances, and net difference payable.
   - Non-Payment Certificate (NPC) signed by your DDO certifying that these dues were not previously drawn.
   - Attested copies of your first appointment order, joining report, and first payslip.
2. Common DAO Objections: If a bill was returned, DAO typically checks whether the DDO signature is verified, whether the budget head is valid, or if the Non-Payment Certificate has original stamps.
3. What to do now: Use the "Arrears Bill (TR-22)" or "Difference Maker" tab on this app. It automatically calculates all Sindh pay scales (2017 to 2022) with exact ad-hoc allowances and lets you download the complete official dossier.`;
  }

  return `Here to help with your question regarding Sindh School Education & Literacy Department procedures.

Whether you need to calculate salary arrears, process 35% commutation and pension papers, prepare an NOC, apply for leave, or resolve an objection from your District Accounts Office (DAO), please feel free to ask your specific query.

I will give you direct, step-by-step guidance and can draft official letters for you without unnecessary delays.`;
}

function generateLocalDraft(docType: string, purpose: string, employee: any, notes: string): string {
  const name = employee?.name || 'The Undersigned';
  const desig = employee?.designation || 'Teacher';
  const bps = employee?.bps || '14';
  const school = employee?.schoolName || 'Govt School';

  if (docType === 'NOC' || docType?.includes('NOC')) {
    return `With due respect, it is submitted that I, ${name}, working as ${desig} (BPS-${bps}) at ${school}, intend to apply for ${purpose || 'official issuance of International Machine Readable Passport / Higher Education'}. 

It is certified that no disciplinary proceedings, inquiries, or audit recoveries are pending against me under the Sindh Civil Servants (Efficiency & Discipline) Rules. I respectfully request that a formal No Objection Certificate (NOC) may kindly be issued in my favour through proper channel.`;
  }

  if (docType === 'Leave' || docType?.includes('Leave')) {
    return `Most respectfully, it is submitted that I, ${name}, ${desig} (BPS-${bps}) posted at ${school}, am in urgent need of leave on account of ${purpose || 'urgent domestic affairs and personal obligations'}.

I therefore request that ${notes || 'Earned / Casual Leave'} may kindly be sanctioned in my favour for the requested duration. I undertake to resume my official duties immediately upon completion of the sanctioned leave.`;
  }

  if (docType === 'Joining' || docType?.includes('Joining')) {
    return `In compliance with the Office Order No. ${notes || 'SELD/DIR/ESTT/2026'}, dated ${new Date().toLocaleDateString('en-GB')}, I, ${name}, have reported for duty and hereby submit my formal Joining Report as ${desig} (BPS-${bps}) at ${school} today on the forenoon/afternoon.

It is requested that my joining report may kindly be accepted and regularized in the official service record and SAP payroll.`;
  }

  return `Respectfully submitted, with reference to the subject cited above, I, ${name}, ${desig} (BPS-${bps}) at ${school}, beg to state that ${purpose || 'the attached case is forwarded for official processing and necessary sanction'}.

All supporting documentation duly attested and verified by the competent DDO are enclosed herewith for kind perusal and early clearance.`;
}

startServer();
