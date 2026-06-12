import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import './SkinChat.css';

// ── Keyword-based response engine ─────────────────────────────────────────────
const RESPONSES = [
  { keys: ['retinol', 'vitamin a', 'retin'], reply: '🌙 Retinol (Vitamin A) is a gold-standard anti-aging ingredient! It boosts collagen, speeds up cell renewal, and fades dark spots. Always use it at night, start 2x a week, and always wear SPF in the morning. Avoid mixing it with AHA/BHA on the same layer.' },
  { keys: ['niacinamide', 'vitamin b3', 'b3'], reply: '✨ Niacinamide (Vitamin B3) is a superstar — it minimizes pores, controls oil, fades dark spots, and strengthens your skin barrier. Safe for all skin types including sensitive skin. You can use it morning and night!' },
  { keys: ['vitamin c', 'ascorbic', 'brightening'], reply: '☀️ Vitamin C is your morning best friend! It\'s a powerful antioxidant that protects against UV damage, brightens skin, and fades pigmentation. Use it in the morning before SPF. Store it away from sunlight to prevent oxidation.' },
  { keys: ['spf', 'sunscreen', 'sun protection', 'uv'], reply: '🛡️ Sunscreen is the #1 anti-aging product! Use SPF 50+ every single day — even indoors or on cloudy days. UV rays penetrate windows! Reapply every 2 hours if outdoors. No skincare routine is complete without it.' },
  { keys: ['acne', 'pimple', 'breakout', 'zit', 'blemish'], reply: '🧴 For acne, try Salicylic Acid (BHA) to unclog pores, or Benzoyl Peroxide for bacterial acne. Don\'t pop pimples — it spreads bacteria and causes scars. Keep skin clean, change pillowcases weekly, and if acne is severe, please see a dermatologist!' },
  { keys: ['dry skin', 'dryness', 'flaky', 'tight skin'], reply: '💧 Dry skin needs extra hydration and barrier repair! Use Hyaluronic Acid on damp skin, then seal with a rich cream (look for ceramides, shea butter). Avoid hot water showers, use a gentle non-stripping cleanser, and add a humidifier at home.' },
  { keys: ['oily skin', 'shiny skin', 'greasy', 'excess oil'], reply: '✨ Oily skin? Don\'t strip it — over-cleansing makes it produce more oil! Use a gentle foaming cleanser, Niacinamide to control sebum, and a lightweight gel moisturizer. BHA (Salicylic Acid) helps keep pores clean. Blotting papers are your best friend.' },
  { keys: ['sensitive', 'redness', 'irritation', 'reactive'], reply: '🌿 Sensitive skin needs gentle, fragrance-free products. Look for Centella Asiatica, Aloe Vera, and Azelaic Acid — they soothe redness and strengthen the barrier. Always do a patch test before trying new products. Avoid physical scrubs and strong actives.' },
  { keys: ['combination skin', 't-zone', 'oily t'], reply: '⚖️ Combination skin needs zone-specific care! Use a lightweight gel moisturizer all over. Apply Niacinamide on the T-zone (forehead, nose, chin) for oil control. Use a slightly richer cream only on dry cheek areas.' },
  { keys: ['dark spot', 'hyperpigmentation', 'pigment', 'uneven tone', 'melasma'], reply: '🌟 Dark spots need consistency! Use Vitamin C in the morning, Niacinamide day and night, and Azelaic Acid or Kojic Acid for stubborn spots. THE most important step is daily SPF — without it, spots darken again. Results take 4-12 weeks.' },
  { keys: ['fine line', 'wrinkle', 'anti aging', 'aging', 'collagen'], reply: '⏳ For fine lines: Retinol is the gold standard (use at night). Peptides help rebuild collagen. Vitamin C protects in the morning. Stay hydrated, use SPF daily, sleep 7-8 hours, and avoid smoking. Consistency over months is key!' },
  { keys: ['routine', 'skincare routine', 'steps', 'order', 'regimen'], reply: '📋 The perfect routine:\n\n🌅 Morning: Cleanser → Vitamin C Serum → Moisturizer → SPF 50+\n\n🌙 Night: Oil Cleanser → Foaming Cleanser → Treatment Serum (Retinol/Niacinamide) → Moisturizer\n\nAlways apply thinnest to thickest consistency!' },
  { keys: ['water', 'hydration', 'drink', 'hydrate', 'glasses'], reply: '💧 Drinking enough water is essential for skin health! Aim for 8 glasses (2 litres) a day. Dehydration makes skin look dull, dry, and tired. Also use topical Hyaluronic Acid — it draws moisture from the environment into your skin.' },
  { keys: ['sleep', 'rest', 'beauty sleep', 'overnight'], reply: '😴 Beauty sleep is real! Your skin repairs itself 3x faster during sleep. Growth hormone peaks at night, rebuilding collagen and new cells. Aim for 7-8 hours. Apply your night cream/serum before sleeping to maximize absorption.' },
  { keys: ['diet', 'food', 'eat', 'nutrition', 'sugar'], reply: '🥗 What you eat shows on your skin! Antioxidant-rich foods (berries, green tea, vegetables) fight skin damage. Omega-3 fatty acids (fish, walnuts) reduce inflammation. Reducing sugar and dairy may help acne-prone skin. Stay consistent!' },
  { keys: ['toner', 'toning'], reply: '💦 Toner balances your skin\'s pH after cleansing and preps it to absorb serums better. Look for hydrating toners (with Hyaluronic Acid, glycerin) rather than old-school alcohol astringents. Apply with hands or cotton pad after cleansing.' },
  { keys: ['serum', 'essence'], reply: '🧪 Serums are concentrated treatments with active ingredients. Apply them after cleansing and toning but before moisturizer. Use targeted serums for your concerns: Vitamin C for brightening, Retinol for aging, Niacinamide for pores and oiliness.' },
  { keys: ['moisturizer', 'moisturise', 'moisturize', 'cream', 'lotion', 'hydrating'], reply: '🧴 Every skin type needs moisturizer — even oily skin! Moisturizer seals in hydration and strengthens the skin barrier. Oily skin: use lightweight gels. Dry skin: richer creams. Look for ceramides, glycerin, or hyaluronic acid on the label.' },
  { keys: ['aha', 'bha', 'exfoliant', 'exfoliate', 'glycolic', 'lactic', 'salicylic'], reply: '🔬 AHA (like Glycolic, Lactic Acid) exfoliates the skin surface, great for dry skin, dark spots, fine lines. BHA (Salicylic Acid) goes inside pores, great for oily/acne-prone skin. Use 2-3x per week only, NOT with Retinol on the same night.' },
  { keys: ['hyaluronic', 'ha serum', 'moisture serum'], reply: '💧 Hyaluronic Acid is a moisture magnet — it can hold 1000x its weight in water! Apply it to DAMP skin (not dry!) right after washing your face, then seal with moisturizer. Works for all skin types, even oily skin.' },
  { keys: ['centella', 'cica', 'tiger grass'], reply: '🌿 Centella Asiatica (CICA) is nature\'s healing herb! It repairs the skin barrier, calms redness and irritation, reduces acne scars, and soothes sensitive skin. Perfect for post-procedure care and reactive skin. Extremely well-tolerated.' },
  { keys: ['hello', 'hi', 'hey', 'helo', 'namaste', 'hii'], reply: '👋 Hello! I\'m your Skin Care AI assistant. I\'m here to answer any questions about skincare ingredients, routines, skin types, and more! What would you like to know today? 😊' },
  { keys: ['thank', 'thanks', 'helpful', 'great'], reply: '😊 You\'re so welcome! Taking care of your skin is an act of self-love. Keep being consistent and your skin will thank you! Is there anything else you\'d like to know?' },
];

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keys.some(k => lower.includes(k))) return r.reply;
  }
  return "🤔 I don't have specific info on that yet, but I'd recommend consulting a certified dermatologist for personalised advice! In the meantime, the golden rules always apply: gentle cleanser, moisturizer, and daily SPF 50+.";
}

const SUGGESTIONS = [
  'What is retinol?',
  'Best routine for oily skin',
  'How to treat acne?',
  'What does Niacinamide do?',
  'SPF tips',
  'How to reduce dark spots?',
];

export default function SkinChat() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: '👋 Hi! I\'m your Skin Care AI. Ask me anything about skincare, ingredients, routines, or skin types! I\'m here to help you glow! ✨' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text.trim() || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), from: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="chat-container pb-nav fade-in">
      {/* Header */}
      <div className="chat-header glass-panel">
        <div className="chat-avatar">✨</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Skin AI Chat</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>● Always available</span>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="suggestion-row">
        {SUGGESTIONS.map(s => (
          <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`bubble-row ${msg.from === 'user' ? 'user-row' : 'bot-row'}`}>
            {msg.from === 'bot' && <div className="bot-avatar-sm">✨</div>}
            <div className={`bubble ${msg.from === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              {msg.text.split('\n').map((line, i) => (
                <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="bubble-row bot-row">
            <div className="bot-avatar-sm">✨</div>
            <div className="bubble bot-bubble typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-bar glass-panel">
        <textarea
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your skin..."
          rows={1}
        />
        <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
