/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Ghost, Flame, Heart, RefreshCcw } from 'lucide-react';
import Markdown from 'react-markdown';

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const transformText = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const model = "gemini-3-flash-preview";
      const response = await genAI.models.generateContent({
        model: model,
        contents: `קח את הטקסט הבא ושלב אותו בתוך משפט אחד או שניים קצרים וקולעים בגוף ראשון (כאילו אני מדבר/ת אליך בשיחה אינטימית). זה חייב להיות אירוטי מאוד, מחרמן ונועז. הטקסט המקורי חייב להופיע כחלק טבעי מהדיבור שלי. כתוב רק טקסט אחד קצר, בלי הקדמות.
        
        הטקסט לשילוב: "${input}"`,
        config: {
          systemInstruction: "You are a master of writing highly erotic, first-person conversational content in Hebrew. Your goal is to take the user's input and weave it into a provocative, sensual, and arousing statement of exactly one or two short sentences, as if you are speaking directly to the user in a private, intimate setting. Use 'I' (גוף ראשון), be extremely bold and descriptive, and ensure the input is a natural part of the erotic narrative. Keep it punchy and short. Always respond with exactly one option in Hebrew.",
          temperature: 1.0,
        },
      });

      const text = response.text;
      if (text) {
        setResult(text);
        // Scroll to result after a short delay to allow animation
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setError('אופס, משהו השתבש... אולי זה היה אירוטי מדי בשביל השרת?');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      transformText();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-pink-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 shadow-lg shadow-pink-500/10">
            <Flame className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400">
            אפליקציית חרמנוביץ
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-light">
            הופך כל משפט למשהו אירוטי ומחרמן
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl"
        >
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="כתוב משהו תמים... (למשל: 'אני אוהב לאכול מלפפון')"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all min-h-[120px] resize-none placeholder:text-zinc-600"
              dir="rtl"
            />
            <div className="absolute top-4 left-4">
              <Sparkles className="w-5 h-5 text-zinc-700" />
            </div>
          </div>

          <button
            onClick={transformText}
            disabled={loading || !input.trim()}
            className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-pink-900/20"
          >
            {loading ? (
              <RefreshCcw className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>תעשה את זה לוהט</span>
                <Send className="w-5 h-5 -rotate-45" />
              </>
            )}
          </button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {(result || error) && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-12 space-y-6"
            >
              {error ? (
                <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-center flex items-center justify-center gap-3">
                  <Ghost className="w-6 h-6" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <Heart className="w-6 h-6 text-pink-500 fill-pink-500/20" />
                      <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">התוצאה המחרמנת</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-xl md:text-2xl leading-relaxed font-medium text-zinc-100 italic" dir="rtl">
                      <Markdown>{result}</Markdown>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => { setInput(''); setResult(''); }}
                  className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-1 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  נקה הכל
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-24 text-center text-zinc-600 text-sm">
          <p>השתמש באחריות. אל תשלח את זה לאמא שלך.</p>
        </footer>
      </main>
    </div>
  );
}
