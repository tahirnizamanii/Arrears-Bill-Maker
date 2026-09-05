import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  BookOpen,
  FileText,
  Copy,
  Check,
  ArrowRight,
  Shield,
  HelpCircle,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { EmployeeData } from '../types';
import { stripMarkdownAsterisks } from '../utils/textUtils';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData?: EmployeeData;
  activeDocumentContext?: string;
  onApplyDraft?: (draftText: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDraft?: boolean;
}

const QUICK_PROMPTS = [
  { label: 'How much is my 35% Commutation?', query: 'How is my 35% commutation calculated and how much monthly pension will I receive?' },
  { label: 'How to get Passport NOC?', query: 'What is the exact process and required documents to get an official Passport NOC in Sindh Education?' },
  { label: 'Why was my DAO Bill returned?', query: 'What are the common reasons District Accounts Office (DAO) returns TR-22 Arrear bills and how to fix them?' },
  { label: 'Draft Leave Application', query: 'Please write a formal Leave Application addressed to my Headmaster / TEO for urgent domestic work.' },
  { label: 'Can I take Ex-Pakistan leave?', query: 'What is the procedure for a government teacher to get Ex-Pakistan leave for Umrah or personal travel?' },
];

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  employeeData,
  activeDocumentContext,
  onApplyDraft,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I am your Sindh Education Administrative Assistant.

Ask me any specific question about your salary, arrears, 35% commutation, leave sanctions, NOC issuance, or DAO billing procedures.

I will directly answer your queries with step-by-step guidance and draft any official letters you need in clean, print-ready plain text.

What question or scenario can I help you resolve today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            designation: employeeData?.designation,
            bps: employeeData?.bps,
            region: employeeData?.region,
            activeDocumentContext,
          },
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      const isLikelyDraft =
        textToSend.toLowerCase().includes('draft') ||
        textToSend.toLowerCase().includes('application') ||
        textToSend.toLowerCase().includes('letter') ||
        textToSend.toLowerCase().includes('justification');

      const rawReply = data.reply || 'Thank you for your inquiry. Please consult the official SELD Gazette for further administrative notifications.';
      const plainTextReply = stripMarkdownAsterisks(rawReply);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: plainTextReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDraft: isLikelyDraft,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Under Sindh Civil Service Rules:
1. Always route administrative applications through the proper channel (Headmaster → TEO → DEO).
2. Attach attested copies of Appointment Order, CNIC, and Service Book.
3. For billing issues, verify DDO Cost Center code with your District Accounts Office (DAO).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    const plainText = stripMarkdownAsterisks(text);
    navigator.clipboard.writeText(plainText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (text: string, id: string) => {
    if (onApplyDraft) {
      const plainText = stripMarkdownAsterisks(text);
      onApplyDraft(plainText);
      setAppliedId(id);
      setTimeout(() => setAppliedId(null), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col h-full text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950">
              <Sparkles className="w-5 h-5 text-emerald-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm tracking-tight text-white">
                  Sindh Govt AI Assistant
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Rules & Drafter
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Civil Servants Rules &bull; Pension &bull; Formats &bull; SELD
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: 'assistant',
                    text: 'Conversation reset. How can I assist you with Sindh Government rules or drafting?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              title="Reset Chat"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.query)}
              className="text-xs bg-slate-800/90 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/60 border border-slate-700/80 text-slate-300 px-3 py-1.5 rounded-lg whitespace-nowrap transition shrink-0 cursor-pointer font-medium"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-slate-900/60">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isBot
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    isBot
                      ? 'bg-slate-800 border border-slate-700 text-slate-100 shadow-sm'
                      : 'bg-indigo-600 text-white rounded-br-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/40 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {isBot && (
                      <div className="flex items-center space-x-1.5 ml-2">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="px-2 py-0.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded flex items-center space-x-1 transition text-[11px]"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {onApplyDraft && (
                          <button
                            onClick={() => handleApply(msg.text, msg.id)}
                            className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded flex items-center space-x-1 transition text-[11px]"
                            title="Insert into active document field"
                          >
                            {appliedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Applied!</span>
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-3 h-3" />
                                <span>Apply to Doc</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg shrink-0 bg-emerald-700 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Consulting Sindh Civil Service Rules & drafting response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about Sindh rules, pension formula, or request a draft..."
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-normal"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl font-medium transition cursor-pointer shrink-0 shadow-md shadow-emerald-950"
              title="Send prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            Grounded in Govt of Sindh Civil Servants Act 1973, SELD Gazette, & Finance Dept Notifications.
          </p>
        </div>

      </div>
    </div>
  );
};
