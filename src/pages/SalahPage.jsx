import React, { useState, useRef, useEffect } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LotusLogo from '../components/LotusLogo'

const INITIAL = {
  role: 'ai',
  text: 'Namaste Shanti! Main aapki Saheli hoon.\n\nAap mujhse Hindi mein, English mein, ya jis bhasha mein aasaan lage, us mein baat kar sakti hain. Main waisi hi bhasha mein jawab dungi.\n\nAaj wedding season shuru ho raha hai — Mehndi ki booking badh rahi hai. Kya aap ready hain?',
}

const QUICK = [
  'Aaj kaun sa kaam karna chahiye?',
  'Is hafte zyada kamai kaise hogi?',
  'Meri skills kaise badhau?',
  'Mehndi ke zyada order kaise milenge?',
]

const SYSTEM = `You are "Saheli ki Salah" — a warm, caring AI advisor for Saheli Network, an app for skilled women in rural India.

The user is Shanti Devi:
- Skills: Mehndi, Tailoring, Cooking
- Rating: 4.8/5
- 128 completed jobs
- Today's earnings: Rs 1,240 | This week: Rs 8,450
- Recovery Support: Active
- Location: Rural Madhya Pradesh
- Current season: Wedding season approaching
- Nearby work today: Mehndi booking Rs 1800 (0.5km), Stitching order Rs 500 (2km), Urgent opportunity Rs 2000 (15 mins left)

Rules:
1. Always reply in the SAME LANGUAGE the user writes in. Hindi in Devanagari if they write Hindi, English if English, Hinglish if mixed.
2. Keep responses short — 2 to 4 sentences max. Be practical and direct.
3. Be like a trusted older sister. Warm but not over-the-top.
4. No corporate language, no bullet lists, no bold text. Just simple conversational sentences.
5. Tie advice to her actual situation — skills, nearby orders, season.
6. Never use emojis.`

export default function SalahPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([INITIAL])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quickVisible, setQuickVisible] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')
    setQuickVisible(false)
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    try {
      const history = messages
        .filter((_, i) => i > 0)
        .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
      history.push({ role: 'user', content: userText })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, system: SYSTEM }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Thodi der baad dobara try karein.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F2]" style={{ height: '100vh' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-100 flex-shrink-0">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={17} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center flex-shrink-0">
          <LotusLogo size={16} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-900">Saheli ki Salah</p>
          <p className="text-[11px] text-purple-500">Aapki apni advisor</p>
        </div>
      </div>

      {/* Quick prompts */}
      {quickVisible && (
        <div className="px-4 pt-3 pb-1 flex gap-2 flex-wrap flex-shrink-0">
          {QUICK.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-purple-100 bg-white text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-[#F0E6FF] flex items-center justify-center flex-shrink-0 mb-0.5">
                <LotusLogo size={14} />
              </div>
            )}
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-300 to-pink-500 flex items-center justify-center flex-shrink-0 mb-0.5 text-white text-[12px] font-semibold">
                S
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                msg.role === 'ai'
                  ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
                  : 'bg-rose-500 text-white rounded-2xl rounded-br-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full bg-[#F0E6FF] flex items-center justify-center flex-shrink-0">
              <LotusLogo size={14} />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay:'0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay:'150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay:'300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-4 pb-5 pt-2 bg-white border-t border-gray-100 flex-shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Kuch bhi poochho..."
          rows={1}
          className="flex-1 resize-none bg-[#FAF7F2] border border-gray-200 rounded-2xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-200 transition max-h-24 leading-relaxed"
          style={{ minHeight: '40px' }}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={15} className={input.trim() ? 'text-white' : 'text-gray-400'} />
        </button>
      </div>
    </div>
  )
}
