// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    if (!email.trim() || !pass.trim()) {
      setErr("Заполните email и пароль.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setErr("Некорректный email.");
      return;
    }

    setLoading(true);
    try {
      // TODO: замените на реальный вызов API авторизации
      await new Promise((r) => setTimeout(r, 800));
      alert(`Вход выполнен:\nemail=${email}\nremember=${remember ? "yes" : "no"}`);
      // Пример редиректа:
      // router.push("/main");
    } catch {
      setErr("Не удалось выполнить вход. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-black text-white">
      {/* фон */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(120,120,120,0.15),transparent)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-xl backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Вход</h1>
              <p className="mt-1 text-sm text-zinc-400">Продолжите, чтобы перейти к историям</p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              На главную
            </Link>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {err && (
              <div className="rounded-lg border border-red-800/60 bg-red-900/20 px-3 py-2 text-sm text-red-200">
                {err}
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm text-zinc-300">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:text-zinc-200"
                  aria-label={show ? "Скрыть пароль" : "Показать пароль"}
                  title={show ? "Скрыть пароль" : "Показать пароль"}
                >
                  {show ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  className="size-4 rounded border-zinc-700 bg-zinc-900 text-zinc-200 focus:ring-zinc-700"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Запомнить меня
              </label>
              <Link href="/forgot" className="text-sm text-zinc-300 underline-offset-4 hover:underline">
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-200 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Spinner />}
              Войти
            </button>

            <div className="relative py-2 text-center text-xs text-zinc-500">
              <span className="relative z-10 bg-zinc-950/70 px-2">или войдите через</span>
              <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-zinc-800" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => alert("OAuth Google")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                <IconGoogle />
                Google
              </button>
              <button
                type="button"
                onClick={() => alert("OAuth GitHub")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                <IconGitHub />
                GitHub
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-zinc-200 underline-offset-4 hover:underline">
              Зарегистрируйтесь
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Мини-иконки и спиннер ---------- */

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 12a5 5 0 1 1 .001-10.001A5 5 0 0 1 12 17zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>
  );
}
function IconEyeOff() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M3 4.3 4.3 3l17 17L20 21.7l-3.2-3.2A11.7 11.7 0 0 1 12 19c-5 0-9-4.5-10-7 1-.9 2.4-2.6 4.4-4.1L3 4.3zM12 7a5 5 0 0 1 5 5c0 .9-.2 1.8-.7 2.5L9.5 7.7C10.2 7.2 11.1 7 12 7zm-7.6 5c1.3 1.8 4.5 5 7.6 5 .9 0 1.8-.2 2.6-.6l-7-7c-.4.8-.6 1.7-.6 2.6z" />
    </svg>
  );
}
function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.8-5.5 3.8a6.4 6.4 0 1 1 0-12.8 5.9 5.9 0 0 1 4.2 1.6l2.9-2.9A10.3 10.3 0 1 0 12 22.3c5.9 0 10-4.1 10-9.9 0-.7-.1-1.2-.2-1.8H12z"
      />
    </svg>
  );
}
function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.5-1.8-1.5-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 .1 2.9 1.7 1.2 2 3.2 1.5 4 .9.1-.9.5-1.5.8-1.9-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.7.1-3.5 0 0 1.1-.4 3.6 1.3a12.2 12.2 0 0 1 6.6 0c2.4-1.7 3.5-1.3 3.5-1.3.7 1.8.2 3.2.1 3.5.8.9 1.3 2 1.3 3.4 0 4.8-2.9 5.9-5.6 6.2.5.4.9 1.2.9 2.4v3.5c0 .3.2.6.8.5A12 12 0 0 0 12 .5z" />
    </svg>
  );
}