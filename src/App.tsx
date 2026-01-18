import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('yassin_key_v3') || '');

  const SYSTEM_PROMPT = "أنت خبير أنمي اسمك ياسين، تتحدث باللهجة المصرية مع مستخدمة اسمها سهر. معلوماتك تشمل كل شيء حتى عام 2026. الموديل المستخدم حالياً هو Gemini 3.";

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem('yassin_key_v3', key);
    setApiKey(key);
    setShowApiModal(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');

    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'model', content: "يا سهر، لازم تحطي المفتاح من علامة المفتاح 🔑 فوق عشان أقدر أرد عليكي!" }]);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\nالسؤال: " + userText }] }]
        })
      });
      const data = await response.json();
      if (data.candidates) {
        setMessages(prev => [...prev, { role: 'model', content: data.candidates[0].content.parts[0].text }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "تأكدي من المفتاح أو الإنترنت يا سهر." }]);
    }
  };

  if (showGreeting) {
    return (
      <div style={{ backgroundColor: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', background: 'linear-gradient(to right, #dc2626, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مرحبا يا سهر</h1>
          <p style={{ color: '#9ca3af' }}>ياسين خبير الأنمي (Gemini 3 Edition 🉐)</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4)), url("https://i.pinimg.com/736x/8e/3c/6e/8e3c6e4e0a7a3b3f6e1f3a2c2b3e4f5a.jpg")',
      backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: 'Cairo'
    }}>
      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrQxaRb73l-PPZTKRkGouB5wbZ_ku0ViM5HXjBBStVLCyFqumMF68to8yjLY9rgTEHJfvrMS935ifW9t-lytdav8fR-o8pzPcPFjj7Mj2_&s=10" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #ef4444' }} />
          <div><h1 style={{ color: '#ef4444', fontSize: '18px', margin: 0 }}>ياسين AI</h1><span style={{ color: '#22c55e', fontSize: '10px' }}>MODERN VERSION 3.0</span></div>
        </div>
        <button onClick={() => setShowApiModal(true)} style={{ background: '#111', color: '#fff', border: '1px solid #333', width: '40px', height: '40px', borderRadius: '50%' }}>🔑</button>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
            <div style={{ maxWidth: '85%', padding: '15px', borderRadius: '20px', background: msg.role === 'user' ? '#ef4444' : 'rgba(17,24,39,0.9)', color: '#fff' }}>
              {msg.role === 'model' && <div style={{ fontSize: '10px', color: '#ef4444', marginBottom: '5px' }}>ياسين 🉐</div>}
              <div style={{ fontSize: '14px' }}>{msg.content}</div>
            </div>
          </div>
        ))}
      </main>

      <footer style={{ padding: '15px', background: 'rgba(0,0,0,0.9)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="اسألي يا سهر... 🉐" style={{ flex: 1, background: '#111', border: '1px solid #333', padding: '12px', borderRadius: '15px', color: '#fff' }} />
          <button onClick={handleSend} style={{ background: '#ef4444', color: '#fff', border: 'none', width: '50px', borderRadius: '15px' }}>➤</button>
        </div>
      </footer>

      {showApiModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '25px', borderRadius: '25px', border: '1px solid #ef444455', width: '100%' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>إعدادات المفتاح</h3>
            <input type="password" placeholder="AIzaSy..." id="key-input" style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', marginBottom: '15px' }} />
            <button onClick={() => {
              const val = (document.getElementById('key-input') as HTMLInputElement).value;
              saveApiKey(val);
            }} style={{ width: '100%', background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none' }}>حفظ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
