import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, Minimize2, Flame, Trophy, RefreshCw } from 'lucide-react';

export const AIChatBot = ({ userName, summaryStats, habits, activeMonthName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${userName}! 👋 I am your Focus AI Assistant. I monitor your daily habit tracker and help you build unbreakable routines. How can I boost your productivity today?`,
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const generateAIResponse = (userMsg) => {
    const text = userMsg.toLowerCase().trim();
    const overallPct = summaryStats.overallProgressPct || 0;
    const completed = summaryStats.completedHabits || 0;

    // 1. Gratitude & Thank You
    if (/^(thank(s|\s+you)?|tq|thx|ty|appreciate\s+it)$/i.test(text) || text.includes('thank you') || text.includes('thanks') || text.includes('tq')) {
      const thankResponses = [
        `You're very welcome, ${userName}! 🌟 Keep showing up for yourself every single day.`,
        `My pleasure, ${userName}! Stay disciplined and keep crushing your goals! 💪`,
        `Always happy to help, ${userName}! You've got this! 🔥`
      ];
      return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }

    // 2. Greetings
    if (/^(hi|hello|hey|greetings|good\s+(morning|evening|afternoon))$/i.test(text)) {
      return `Hey ${userName}! 👋 Ready to build unbreakable habits today? Let's check off your daily goals!`;
    }

    // 3. Dedication / Discipline / Focus Questions
    if (text.includes('dedication') || text.includes('discipline') || text.includes('improve') || text.includes('consistency') || text.includes('focus')) {
      return `🎯 **3 Secrets to Build Unshakable Dedication (${userName}):**\n1. **Habit Stacking**: Attach new habits to fixed daily anchors (e.g., 'Right after 5 AM wake-up, I do 10 minutes of journaling').\n2. **The 2-Minute Rule**: Make starting so easy that you can't say no (e.g., just put on gym shoes).\n3. **Visual Tracking**: Ticking off boxes on your grid triggers a dopamine feedback loop that reinforces dedication!`;
    }

    // 4. Progress Analysis
    if (text.includes('analyze') || text.includes('progress') || text.includes('stats')) {
      return `📊 **${userName}'s ${activeMonthName} Progress Report:**\n- Overall Monthly Rate: **${overallPct}%**\n- Total Completed Checks: **${completed}** habits!\n- Active Habits Tracked: **${habits.length}**\n\n💡 *AI Recommendation:* ${overallPct > 50 ? 'You are in a great momentum flow! Keep maintaining your morning routine.' : 'Focus on completing 2 core habits daily first to build consistency momentum.'}`;
    }

    // 5. Motivation & Quotes
    if (text.includes('motivation') || text.includes('quote') || text.includes('fuel')) {
      const quotes = [
        `"Pain is temporary, discipline lasts forever." Keep pushing, ${userName}! 💪`,
        `"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle`,
        `"Small daily improvements over time lead to stunning results." Stay focused today, ${userName}! 🚀`
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // 6. Streaks & Missed Days
    if (text.includes('streak') || text.includes('break') || text.includes('missed')) {
      return `🧘 **Never miss twice, ${userName}!** If you break a streak for one day, don't worry. The rule is to recover immediately the next day to solidify your identity.`;
    }

    // 7. Morning & 5 AM Routine
    if (text.includes('5 am') || text.includes('morning') || text.includes('wake up')) {
      return `⏰ **5 AM Morning Routine Formula:**\n1. Prepare clothes & water the night before.\n2. Place alarm away from your bed.\n3. Drink 500ml water immediately upon waking.\n4. Do 10 minutes of journaling & light stretch!`;
    }

    // Varied Fallback
    const fallbacks = [
      `That's a great focus point, ${userName}! Remember: Small 1% daily wins lead to massive yearly transformations. Keep ticking those boxes! 🔥`,
      `Every daily check mark you log brings you closer to your ideal routine, ${userName}. Keep building your momentum! 🚀`,
      `Consistency is your superpower, ${userName}. Focus on completing your priority habits today! 💪`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: generateAIResponse(messageText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating AI Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 990,
            background: 'linear-gradient(135deg, var(--accent-green), #16a34a)',
            color: '#000000',
            border: 'none',
            borderRadius: '999px',
            padding: '0.85rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 8px 25px rgba(34, 197, 94, 0.45)',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          className="ai-chat-trigger"
        >
          <Sparkles size={20} color="#000" />
          <span>Focus AI Chat</span>
        </button>
      )}

      {/* Chat Bot Drawer Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          maxHeight: '560px',
          height: '85vh',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }} className="glass-panel">
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-table-header)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-green), #15803d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}>Focus AI Coach</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600 }}>Active for {userName}</span>
              </div>
            </div>

            <button 
              className="action-icon-btn" 
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                <div style={{
                  padding: '0.7rem 0.95rem',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: msg.sender === 'user' ? 'var(--accent-green)' : 'var(--bg-card-hover)',
                  color: msg.sender === 'user' ? '#000000' : 'var(--text-primary)',
                  fontSize: '0.86rem',
                  fontWeight: msg.sender === 'user' ? 600 : 400,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.45,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} className="animate-spin" /> AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', whiteSpace: 'nowrap' }}
              onClick={() => handleSend('Analyze my progress')}
            >
              📊 Analyze Stats
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', whiteSpace: 'nowrap' }}
              onClick={() => handleSend('Give me daily motivation')}
            >
              🔥 Motivation
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', whiteSpace: 'nowrap' }}
              onClick={() => handleSend('Help with 5 AM morning routine')}
            >
              ⏰ 5 AM Routine
            </button>
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.5rem',
              background: 'var(--bg-table-header)'
            }}
          >
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
              placeholder="Ask AI for habit advice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.85rem' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
