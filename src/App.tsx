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
    const timer = setTimeout(() => setShowGreeting(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string, isTopic = false) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: isTopic ? `كلمني عن ${text}` : text };
    setMessages(prev => [...prev, userMsg]);
    
    if (!isTopic) setInput('');

    setTimeout(() => {
      let response = "استغفر الله العظيم أهدى يا سهر لسه في تحديثات قادمة... 🚀 اسأليني عن التاريخ أو الإحصائيات!";
      if (isTopic && animeKnowledge[text]) {
        response = animeKnowledge[text];
      } else {
        for (let key in animeKnowledge) {
          if (text.includes(key)) { response = animeKnowledge[key]; break; }
        }
      }
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    }, 1000);
  };

  if (showGreeting) {
    return (
      <div style={{ backgroundColor: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', background: 'linear-gradient(to right, #dc2626, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px' }}>مرحبا يا سهر</h1>
          <p style={{ color: '#9ca3af', fontSize: '1.2rem' }}>ياسين خبير الأنمي من 1907 لـ 2025 🉐</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      {/* Header */}
      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.85)', borderBottom: '1px solid #7f1d1d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrQxaRb73l-PPZTKRkGouB5wbZ_ku0ViM5HXjBBStVLCyFqumMF68to8yjLY9rgTEHJfvrMS935ifW9t-lytdav8fR-o8pzPcPFjj7Mj2_&s=10" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #dc2626' }} />
          <div>
            <h2 style={{ color: '#ef4444', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>ياسين - ヤシン</h2>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>خبير الأنمي (1907 - 2025)</span>
          </div>
        </div>
        <button onClick={() => setShowTopics(!showTopics)} style={{ background: '#7f1d1d66', color: '#fff', border: '1px solid #991b1b', padding: '5px 15px', borderRadius: '20px', fontSize: '12px' }}>مواضيع</button>
      </header>

      {/* Topics Menu */}
      {showTopics && (
        <div style={{ padding: '15px', background: '#111', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {Object.keys(animeKnowledge).map(key => (
            <button key={key} onClick={() => { handleSend(key, true); setShowTopics(false); }} style={{ background: '#1f293780', padding: '10px', borderRadius: '10px', border: '1px solid #ef444433', fontSize: '12px', color: '#fff' }}>{key}</button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }}>
        <div style={{ marginBottom: '20px', background: '#111', padding: '15px', borderRadius: '15px', border: '1px solid #374151' }}>
          <p style={{ color: '#ef4444', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>ياسين - ヤシン</p>
          <p style={{ fontSize: '14px' }}>أهلاً يا سهر! أنا ياسين، جاهز لأي سؤال عن الأنمي من 1907 لـ 2025! 🉐</p>
        </div>

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
            <div style={{ maxWidth: '85%', padding: '12px', borderRadius: '15px', background: msg.role === 'user' ? '#b91c1c' : '#111', border: msg.role === 'user' ? 'none' : '1px solid #374151' }}>
               <div dangerouslySetInnerHTML={{ __html: msg.content }} style={{ fontSize: '14px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ padding: '20px', background: '#000', borderTop: '1px solid #7f1d1d33' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="اسألي يا سهر... 🉐" 
            style={{ flex: 1, background: '#111', border: '1px solid #374151', padding: '12px', borderRadius: '12px', color: '#fff', outline: 'none' }} 
          />
          <button onClick={() => handleSend(input)} style={{ background: '#dc2626', width: '50px', height: '50px', borderRadius: '12px', border: 'none', color: '#fff' }}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
