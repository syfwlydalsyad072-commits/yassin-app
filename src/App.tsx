import React, { useState } from 'react';
import { GeminiService } from './geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const saveKey = () => {
    if (tempKey.trim().length < 20) { alert('الرجاء إدخال مفتاح صحيح'); return; }
    localStorage.setItem('sahar_api_key', tempKey.trim());
    alert('تم حفظ المفتاح! ✅');
    setShowSettings(false);
    setTempKey('');
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);
    const res = await GeminiService.generateResponse(q);
    setMessages(prev => [...prev, { role: 'model', content: res }]);
    setLoading(true); // للتجربة فقط سنغيرها بكرة
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ef4444' }}>
        <h2 style={{ color: '#ef4444', margin: 0 }}>ياسين خبير الأنمي 🉐</h2>
        <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px' }}>⚙️</button>
      </header>
      {showSettings && (
        <div style={{ padding: '20px', background: '#111' }}>
          <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="AIza..." style={{ width: '70%', padding: '10px' }} />
          <button onClick={saveKey} style={{ background: '#ef4444', color: '#fff', padding: '10px' }}>حفظ</button>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ background: msg.role === 'user' ? '#ef4444' : '#222', padding: '10px', borderRadius: '10px', display: 'inline-block' }}>{msg.content}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '15px', display: 'flex', gap: '5px' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1, padding: '10px' }} placeholder="اسألي ياسين..." />
        <button onClick={handleSend} style={{ background: '#ef4444', color: '#fff', padding: '10px' }}>إرسال</button>
      </div>
    </div>
  );
};
export default App;
