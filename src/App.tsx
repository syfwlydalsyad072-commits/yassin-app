import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showTopics, setShowTopics] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const animeKnowledge: any = {
    history: "📜 <b>الجذور التاريخية (1907-1945):</b><br/>• سنة 1907: <span style='color:#fbbf24'>كاتسودو شاشين</span> - أقدم نموذج!<br/>• سنة 1917: <span style='color:#fbbf24'>ناماكورا غاتانا</span> - أول فيلم فكاهي!",
    tizuka: "🎭 <b>عصر تيزوكا (1950-1969):</b><br/>• <span style='color:#fbbf24'>أوسامو تيزوكا</span> - إله المانغا!<br/>• سنة 1963: <span style='color:#fbbf24'>أسترو بوي</span> - أول نجاح تلفزيوني!",
    golden: "🌟 <b>العصر الذهبي (1980-1999):</b><br/>• سنة 1988: <span style='color:#fbbf24'>أكيرا</span> ثورة عالمية!<br/>• سنة 1985: تأسيس <span style='color:#fbbf24'>استوديو جيبلي</span>.",
    modern: "🚀 <b>العصر الحديث (2000-2025):</b><br/>• سنة 2019: <span style='color:#fbbf24'>قاتل الشياطين</span> ثورة بصرية!<br/>• سنة 2024: <span style='color:#fbbf24'>سولو ليفيلينغ</span> وتوسع المانهوا.",
    statistics: "📊 <b>إحصائيات 2025:</b><br/><div style='background:rgba(0,0,0,0.5); border-right:4px solid #10b981; padding:8px; margin:6px 0;'>• حجم السوق: <span style='color:#fbbf24'>25.1 مليار دولار</span></div>",
    studios: "🎬 <b>الاستوديوهات:</b><br/>• <span style='color:#fbbf24'>MAPPA:</span> هجوم العمالقة.<br/>• <span style='color:#fbbf24'>ufotable:</span> ملوك الـ CGI.",
    arabic: "🌙 <b>الأنمي العربي:</b><br/>• السبعينيات: <span style='color:#fbbf24'>غريندايزر</span>.<br/>• سنة 2000: <span style='color:#fbbf24'>سبيستون</span> قناة شباب المستقبل."
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string, isTopic = false) => {
    const val = text.trim();
    if (!val) return;

    setMessages(prev => [...prev, { role: 'user', content: isTopic ? "أخبرني عن " + val : val }]);
    if (!isTopic) setInput('');

    setTimeout(() => {
      let response = "استغفر الله العظيم أهدى يا سهر لسه في تحديثات قادمة... 🚀 اسأليني عن التاريخ أو الإحصائيات!";
      const key = isTopic ? text : Object.keys(animeKnowledge).find(k => val.includes(k));
      if (key && animeKnowledge[key]) response = animeKnowledge[key];
      
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    }, 800);
  };

  if (showGreeting) {
    return (
      <div style={{ backgroundColor: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', fontFamily: 'Cairo' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', background: 'linear-gradient(to right, #dc2626, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مرحبا يا سهر</h1>
          <p style={{ color: '#9ca3af', marginTop: '10px' }}>ياسين خبير الأنمي من 1907 لـ 2025 🉐</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: 'Cairo' }}>
      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid #7f1d1d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrQxaRb73l-PPZTKRkGouB5wbZ_ku0ViM5HXjBBStVLCyFqumMF68to8yjLY9rgTEHJfvrMS935ifW9t-lytdav8fR-o8pzPcPFjj7Mj2_&s=10" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #ef4444' }} />
          <h2 style={{ color: '#ef4444', margin: 0, fontSize: '16px' }}>ياسين - ヤシン</h2>
        </div>
        <button onClick={() => setShowTopics(!showTopics)} style={{ background: '#7f1d1d', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>مواضيع</button>
      </header>

      {showTopics && (
        <div style={{ padding: '10px', background: '#111', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {['history', 'modern', 'statistics', 'arabic'].map(topic => (
            <button key={topic} onClick={() => { handleSend(topic, true); setShowTopics(false); }} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '8px', borderRadius: '8px', fontSize: '11px' }}>{topic}</button>
          ))}
        </div>
      )}

      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        <div style={{ background: '#111', padding: '12px', borderRadius: '12px', border: '1px solid #333', marginBottom: '15px' }}>
          <p style={{ fontSize: '14px' }}>أهلاً يا سهر! أنا ياسين، جاهز لأي سؤال عن الأنمي من 1907 لـ 2025! 🉐</p>
        </div>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
            <div style={{ maxWidth: '85%', padding: '10px', borderRadius: '12px', background: msg.role === 'user' ? '#b91c1c' : '#1a1a1a', border: msg.role === 'user' ? 'none' : '1px solid #333' }}>
              <div dangerouslySetInnerHTML={{ __html: msg.content }} style={{ fontSize: '14px', lineHeight: '1.5' }} />
            </div>
          </div>
        ))}
      </div>

      <footer style={{ padding: '15px', background: '#000', borderTop: '1px solid #222' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder="اسألي يا سهر... 🉐" style={{ flex: 1, background: '#111', border: '1px solid #333', padding: '10px', borderRadius: '10px', color: '#fff' }} />
          <button onClick={() => handleSend(input)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '10px' }}>ارسال</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
