// app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Kind = "message" | "event" | "change";

type Msg = {
  id: string;
  author: "user" | "bot";
  text: string;
  kind: Kind;
  ts: number;
};

const KIND_LABEL: Record<Kind, string> = {
  message: "Сообщение",
  event: "Событие",
  change: "Изменение",
};

function Bubble({
  side,
  name,
  children,
}: {
  side: "left" | "right";
  name?: string;
  children: React.ReactNode;
}) {
  const isRight = side === "right";
  return (
    <div className={`w-full flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-3 ${isRight ? "flex-row-reverse" : ""}`}>
        {/* Аватар */}
        <div className="h-9 w-9 rounded-full bg-zinc-700/40" />
        <div className="flex flex-col items-start gap-2">
          {name ? (
            <div
              className={`text-xs text-zinc-400 ${isRight ? "self-end text-right" : ""}`}
            >
              {name}
            </div>
          ) : null}
          <div
            className={`rounded-2xl bg-zinc-900 text-zinc-50 px-5 py-3 max-w-[600px] ${
              isRight ? "rounded-br-sm" : "rounded-bl-sm"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function KindTag({ kind }: { kind: Kind }) {
  const styles: Record<Kind, string> = {
    message:
      "bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-500/30",
    event:
      "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
    change:
      "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[kind]}`}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      author: "bot",
      text: "Привет! Выбери тип и напиши сообщение — я отвечу слева.",
      kind: "event",
      ts: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState<Kind>("message");
  const endRef = useRef<HTMLDivElement | null>(null);

  // автоскролл к последнему сообщению
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const canSend = useMemo(
    () => draft.trim().length > 0,
    [draft]
  );

  function handleSend() {
    if (!canSend) return;

    const text = draft.trim();
    setDraft("");

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      author: "user",
      text,
      kind,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Простая имитация ответа «собеседника»
    window.setTimeout(() => {
      const replyText = makeAutoReply(text, kind);
      const botMsg: Msg = {
        id: crypto.randomUUID(),
        author: "bot",
        text: replyText,
        kind, // отвечаем тем же типом для наглядности
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  }

  function makeAutoReply(text: string, k: Kind) {
    switch (k) {
      case "message":
        return `Принял сообщение: “${text}”. Спасибо!`;
      case "event":
        return `Событие зафиксировано: “${text}”. Хочешь добавить дату/время?`;
      case "change":
        return `Изменение учтено: “${text}”. Проверю влияние на остальные записи.`;
      default:
        return `Окей: ${text}`;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 sm:px-6">
        {/* Шапка */}
        <header className="sticky top-0 z-10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
              Диалог
            </h1>
            <span className="text-xs text-zinc-400">
              Тип: <strong className="text-zinc-300">{KIND_LABEL[kind]}</strong>
            </span>
          </div>
        </header>

        {/* Лента сообщений */}
        <section className="flex-1 space-y-8 pb-36">
          {messages.map((m) => (
            <div key={m.id} className="space-y-1">
              {m.author === "user" ? (
                <Bubble side="right" name="Вы">
                  <div className="flex items-start gap-2">
                    <KindTag kind={m.kind} />
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </Bubble>
              ) : (
                <Bubble side="left" name="Собеседник">
                  <div className="flex items-start gap-2">
                    <KindTag kind={m.kind} />
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </Bubble>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </section>

        {/* Панель ввода */}
        <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Переключатель типа */}
              <div className="w-full grid grid-cols-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-0.5 gap-0.5">
                {([
                  { v: "message", label: "Сообщение" },
                  { v: "event", label: "Событие" },
                  { v: "change", label: "Изменение" },
                ] as { v: Kind; label: string }[]).map((opt) => {
                  const active = kind === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setKind(opt.v)}
                      className={`px-3 py-2 text-xs sm:text-sm font-medium transition ${
                        active
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-300 hover:bg-zinc-900"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Поле ввода и кнопка */}
              <div className="flex w-full items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напишите сообщение и нажмите Enter…"
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className="rounded-xl bg-zinc-200 text-black px-4 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 transition"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
