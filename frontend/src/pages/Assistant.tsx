import { FormEvent, KeyboardEvent, useState } from 'react';
import { AlertTriangle, Bot, MessageSquarePlus, Send, Sparkles, User } from 'lucide-react';
import { aiApi } from '../api/client';

type ChatMessage = { id: number; role: 'user' | 'assistant'; content: string };

const suggestions = [
  '현재 위험한 장애 분석',
  'Cluster 상태 진단',
  'Pod 이상 탐지',
  'CPU/Memory 과부하 분석',
  'Deployment 실패 원인 분석',
];

const risks = [
  'Jenkins 배포 실패',
  '메모리 사용량 경고',
  'payment-api 재시작 감지',
  'Git 동기화 대기중',
];

const initialMessages: ChatMessage[] = [
  { id: 1, role: 'assistant', content: 'AegisOps 운영 분석 Assistant입니다. Pod, 로그, API 오류, 배포 실패를 자연어로 질문해 주세요.' },
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: text };
    const history = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    setMessages(previous => [...previous, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = JSON.parse(localStorage.getItem('aegis_dashboard_context') || 'null');
      const response = await aiApi.analyze(text, context, history);
      setMessages(previous => [...previous, { id: Date.now() + 1, role: 'assistant', content: response.data.result || '응답이 비어 있습니다.' }]);
    } catch {
      setMessages(previous => [...previous, { id: Date.now() + 1, role: 'assistant', content: 'AI 모델 서버에 연결할 수 없습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const newChat = () => {
    setMessages(initialMessages);
    setInput('');
    setLoading(false);
  };

  return <div className="flex h-[calc(100vh-5rem)] min-h-[560px] flex-col gap-3">
    <div className="flex items-center justify-between">
      <div><h3 className="text-lg font-semibold text-white">AI Assistant</h3><p className="mt-0.5 text-xs text-brand-muted">인프라 운영 질문을 대화형으로 분석합니다.</p></div>
      <button onClick={newChat} className="btn-secondary inline-flex items-center gap-2"><MessageSquarePlus size={14} />새 대화</button>
    </div>

    <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[1fr_280px]">
      <section className="card flex min-h-0 flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map(message => <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400"><Bot size={15} /></span>}
            <div className={`max-w-[78%] rounded-2xl border px-3 py-2 text-sm leading-6 ${message.role === 'user' ? 'border-blue-500/30 bg-blue-500/15 text-slate-100' : 'border-slate-700/70 bg-slate-900/70 text-slate-200'}`}><p className="whitespace-pre-wrap">{message.content}</p></div>
            {message.role === 'user' && <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300"><User size={15} /></span>}
          </div>)}
          {loading && <div className="flex gap-2"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400"><Bot size={15} /></span><div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-brand-muted">분석 중...</div></div>}
        </div>

        <form onSubmit={send} className="border-t border-slate-800 p-3">
          <div className="flex gap-2 rounded-xl border border-slate-700/70 bg-slate-950/70 p-2 focus-within:border-blue-500/60">
            <textarea spellCheck={false} value={input} onChange={event => setInput(event.target.value)} onKeyDown={onKeyDown} className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-100 outline-none placeholder:text-brand-muted" placeholder="예: payment-api Pod 재시작 원인을 현재 운영 상태 기준으로 분석해줘" />
            <button disabled={loading || !input.trim()} className="btn-primary self-end disabled:cursor-not-allowed disabled:opacity-50"><Send size={14} /></button>
          </div>
        </form>
      </section>

      <aside className="space-y-3">
        <section className="card">
          <h4 className="font-semibold text-white">대화 정보</h4>
          <div className="mt-3 space-y-2 text-xs text-brand-muted"><p>모드: 운영 분석</p><p>대화 기억: 최근 8개 메시지</p><p>실제 인프라 명령: 실행 안 함</p></div>
        </section>
        <section className="card">
          <div className="mb-3 flex items-center gap-2"><Sparkles size={15} className="text-blue-400" /><h4 className="font-semibold text-white">운영 분석 실행</h4></div>
          <div className="grid grid-cols-2 gap-1.5">{suggestions.map(question => <button key={question} onClick={() => setInput(question)} className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-2 text-left text-[11px] text-brand-muted hover:border-blue-500/40 hover:text-slate-100">{question}</button>)}</div>
        </section>
        <section className="card">
          <div className="mb-3 flex items-center gap-2"><AlertTriangle size={15} className="text-amber-400" /><h4 className="font-semibold text-white">최근 운영 이상 징후</h4></div>
          <div className="space-y-1.5">{risks.map(risk => <p key={risk} className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-1.5 text-xs text-brand-muted">{risk}</p>)}</div>
        </section>
      </aside>
    </div>
  </div>;
}
