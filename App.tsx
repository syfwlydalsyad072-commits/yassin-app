
import React, { useState, useRef, useEffect } from 'react';
import SaharGreeting from './components/SaharGreeting';
import ChatMessage from './components/ChatMessage';
import DynamicEren from './components/DynamicEren';
import { GeminiService } from './geminiService';
import { Message, AppStatus, ErenMood, AssistantMode, AppTheme } from './types';

const STORAGE_KEY = 'yassin_ultimate_final';

const SOUNDS = {
  receive: "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3",
  send: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3",
  greet: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3"
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.GREETING);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<ErenMood>('neutral');
  const [mode, setMode] = useState<AssistantMode>('محقق');
  const [theme, setTheme] = useState<AppTheme>('إيرين');
  const [dailyQuote, setDailyQuote] = useState("ياسين بيجهز لك قلشة الصباح...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const geminiRef = useRef<GeminiService>(new GeminiService());
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    audioRefs.current = {
      receive: new Audio(SOUNDS.receive),
      send: new Audio(SOUNDS.send),
      greet: new Audio(SOUNDS.greet)
    };
    
    (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
      audio.volume = 0.25;
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      }
      setTheme(data.theme || 'إيرين');
      setMode(data.mode || 'محقق');
      setIsSoundEnabled(data.isSoundEnabled !== undefined ? data.isSoundEnabled : true);
    }
    
    geminiRef.current.generateDailySurprise("سهر").then(setDailyQuote);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'إيرين' ? 'eren' : theme === 'ساكورا' ? 'sakura' : theme === 'ليل' ? 'night' : 'ocean');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, theme, mode, isSoundEnabled }));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, theme, mode, isSoundEnabled]);

  const playEffect = (type: keyof typeof SOUNDS) => {
    if (isSoundEnabled && audioRefs.current[type]) {
      audioRefs.current[type].currentTime = 0;
      audioRefs.current[type].play().catch(() => {});
    }
  };

  const handleSend = async (customInput?: string) => {
    const text = (customInput || input).trim();
    if (!text || loading) return;

    if (text === '/مسح') {
      setMessages([]);
      setInput('');
      return;
    }

    playEffect('send');
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await geminiRef.current.sendMessage(messages, text, mode, "سهر");
      setCurrentMood(res.mood);
      playEffect('receive');
      setMessages(prev => [...prev, {
        role: 'model',
        content: res.text,
        timestamp: new Date(),
        sources: res.sources,
        mood: res.mood
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "يا اسطى أنت سحلت السيرفر بهبدك! مابقتش فاهم أنت بتقول إيه.. وضح كلامك بدل ما أعملك بان.", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) return alert("متصفحك لا يدعم التعرف على الصوت!");
    const rec = new Recognition();
    rec.lang = 'ar-EG';
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => handleSend(e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const completeGreeting = () => {
    setStatus(AppStatus.CHAT);
    playEffect('greet');
  };

  if (status === AppStatus.GREETING) return <SaharGreeting onComplete={completeGreeting} />;

  return (
    <div className="flex flex-col h-screen relative overflow-hidden bg-black text-white selection:bg-red-500/30">
      <DynamicEren mood={currentMood} theme={theme} />

      {/* Sidebar - Settings */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-black/98 backdrop-blur-3xl z-[100] border-l border-white/10 transform transition-all duration-500 ease-out shadow-[0_0_100px_rgba(0,0,0,1)] p-8 ${isSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-all hover:rotate-90 text-xl">✕</button>
        <h3 className="text-xl font-black mb-10 border-b border-red-600/30 pb-4 text-red-500 tracking-tighter">الإعدادات</h3>
        
        <div className="space-y-8">
          <section>
            <label className="text-[10px] uppercase font-black text-gray-500 mb-4 block tracking-[0.3em]">نمط الشخصية</label>
            <div className="grid grid-cols-2 gap-3">
              {(['محقق', 'أوتاكو', 'صديق', 'لعبة'] as AssistantMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)} className={`p-3 rounded-2xl text-[10px] font-black transition-all border ${mode === m ? 'bg-red-600 border-red-500 shadow-xl' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>{m}</button>
              ))}
            </div>
          </section>

          <section>
            <label className="text-[10px] uppercase font-black text-gray-500 mb-4 block tracking-[0.3em]">الثيم</label>
            <div className="grid grid-cols-2 gap-3">
              {(['إيرين', 'ساكورا', 'ليل', 'محيط'] as AppTheme[]).map(t => (
                <button key={t} onClick={() => setTheme(t)} className={`p-3 rounded-2xl text-[10px] font-black transition-all border ${theme === t ? 'border-red-500 bg-red-500/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>{t}</button>
              ))}
            </div>
          </section>

          <section>
            <label className="text-[10px] uppercase font-black text-gray-500 mb-4 block tracking-[0.3em]">الأصوات</label>
            <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className={`w-full p-4 rounded-2xl text-[10px] font-black transition-all border flex items-center justify-between ${isSoundEnabled ? 'bg-green-600/10 border-green-500/30 text-green-400' : 'bg-gray-800/30 border-white/5 text-gray-500'}`}>
              <span>{isSoundEnabled ? 'الأصوات مفعلة 🔥' : 'صامت 🔇'}</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isSoundEnabled ? 'bg-green-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isSoundEnabled ? 'left-6' : 'left-1'}`}></div>
              </div>
            </button>
          </section>
        </div>
      </div>

      <header className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-3xl border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 p-[1.5px] shadow-[0_0_10px_rgba(239,68,68,0.2)]">
               <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                  <img src="https://i.pinimg.com/736x/8e/3c/6e/8e3c6e4e0a7a3b3f6e1f3a2c2b3e4f5a.jpg" className="w-full h-full object-cover" />
               </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_5px_#22c55e]"></div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none mb-0.5">ياسين برو <span className="text-red-500 opacity-60 text-xs">V.FINAL</span></h1>
            <div className="flex gap-2 items-center">
              <span className="text-[8px] px-2 py-0.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-full font-black uppercase">{mode}</span>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">شغال ⚡</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all">
          <span className="inline-block text-lg">⚙️</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide z-10" ref={scrollRef}>
        <div className="mb-8 p-6 bg-gradient-to-br from-white/10 via-transparent to-transparent backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px]"></div>
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-[9px] font-black text-red-500 tracking-[0.4em] uppercase opacity-70">قلشة ياسين ⚔️</h4>
              <span className="text-[8px] text-gray-600 font-black">ULTIMATE</span>
           </div>
           <p className="text-lg md:text-xl font-black italic leading-tight text-white/95 max-w-2xl">"{dailyQuote}"</p>
           <div className="mt-6 flex flex-wrap gap-3">
             <button onClick={() => handleSend("قولي رأيك بصراحة في أنمي ون بيس")} className="text-[11px] px-6 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all font-black border border-white/5">رأي أوتاكو 🔥</button>
             <button onClick={() => handleSend("أنا بحب أنمي بوروتو")} className="text-[11px] px-6 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all font-black border border-white/5">اختبر صبري 😂</button>
           </div>
        </div>

        {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
        
        {loading && (
          <div className="flex items-center gap-3 p-4 bg-black/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-lg animate-pulse">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">جاري الهبد... 🧠</span>
          </div>
        )}
      </main>

      <footer className="p-4 md:p-6 bg-black/95 backdrop-blur-3xl z-50 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <button onClick={startVoice} className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 border-2 ${isListening ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
            <span className="text-xl">{isListening ? "🎤" : "🎙️"}</span>
          </button>
          <div className="flex-1 relative group">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "ياسين سامعك.." : "اكتب سحلتك هنا.."}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-base focus:outline-none transition-all focus:border-red-600"
            />
          </div>
          <button onClick={() => handleSend()} disabled={!input.trim() || loading} className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl text-base hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50">
            <span>إرسـال</span>
          </button>
        </div>
        <p className="text-center mt-3 text-[9px] font-black text-gray-800 tracking-[0.5em] uppercase">Yassin Pro Persona</p>
      </footer>
    </div>
  );
};

export default App;
