// app/page.tsx
"use client";

import { useMemo, useState } from "react";

/* ---------------------------- Типы и данные ---------------------------- */

type Genre = "D&D" | "Classic" | "Anime" | "Sci-Fi" | "Fantasy" | "Horror";
type Status = "draft" | "published" | "archived";

type Story = {
  id: string;
  title: string;
  description: string;
  genre: Genre;
  status: Status;
  players: number;    // сколько игроков проходило
  sessions: number;   // сколько сессий создано
  updatedAt: string;  // ISO
  cover?: string;     // URL обложки (может не быть)
};

const SEED: Story[] = [
  {
    id: "1",
    title: "Темницы Арк-Нора",
    description: "Классическое приключение с ветвлениями и таймерами.",
    genre: "D&D",
    status: "published",
    players: 3421,
    sessions: 9182,
    updatedAt: "2025-11-08T10:00:00Z",
  },
  {
    id: "2",
    title: "Кафе на краю аниме-мира",
    description: "Лёгкая романтическая история с элементами фэнтези.",
    genre: "Anime",
    status: "published",
    players: 1056,
    sessions: 2212,
    updatedAt: "2025-10-29T21:00:00Z",
  },
  {
    id: "3",
    title: "Старая школа",
    description: "Короткая «classic» история в стиле олд-скул квестов.",
    genre: "Classic",
    status: "draft",
    players: 224,
    sessions: 641,
    updatedAt: "2025-11-10T08:30:00Z",
  },
  {
    id: "4",
    title: "Экспедиция «Гелиос»",
    description: "Sci-Fi сеттинг: корабль-архив и исчезнувшая команда.",
    genre: "Sci-Fi",
    status: "published",
    players: 1998,
    sessions: 5133,
    updatedAt: "2025-11-01T13:10:00Z",
  },
  {
    id: "5",
    title: "Город без солнца",
    description: "Нуар-фэнтези о долгах, магии и выборе.",
    genre: "Fantasy",
    status: "draft",
    players: 377,
    sessions: 954,
    updatedAt: "2025-11-11T12:15:00Z",
  },
  {
    id: "6",
    title: "Дом на холме",
    description: "Психологический хоррор с системой рассудка.",
    genre: "Horror",
    status: "published",
    players: 884,
    sessions: 2140,
    updatedAt: "2025-10-20T16:45:00Z",
  },
];

/* ------------------------------ Утилиты ------------------------------ */

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

const GENRE_BADGE: Record<Genre, string> = {
  "D&D": "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30",
  Classic: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/30",
  Anime: "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/30",
  "Sci-Fi": "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30",
  Fantasy: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  Horror: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
};

const STATUS_BADGE: Record<Status, string> = {
  draft: "bg-zinc-700/40 text-zinc-200",
  published: "bg-green-600/20 text-green-300",
  archived: "bg-zinc-800/80 text-zinc-400",
};

const ALL_GENRES: Genre[] = ["D&D", "Anime", "Classic", "Sci-Fi", "Fantasy", "Horror"];

/* --------------------------- Компоненты UI --------------------------- */

function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-zinc-800/80 fixed top-0 left-0 bottom-0 bg-black z-20">
      <div className="px-4 py-3 text-sm text-zinc-400">Навигация</div>
      <nav className="flex-1 px-2 py-2 space-y-1">
        <NavItem active icon={<IconGrid />} label="Истории" />
        <NavItem icon={<IconSparkles />} label="Шаблоны" />
        <NavItem icon={<IconBookOpen />} label="Библиотека" />
        <NavItem icon={<IconChart />} label="Аналитика" />
        <NavItem icon={<IconSettings />} label="Настройки" />
      </nav>
      <div className="p-4 mt-auto">
        <button className="w-full inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900 transition">
          <IconLogout />
          Выйти
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={classNames(
        "w-full inline-flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
      )}
    >
      <span className="size-4">{icon}</span>
      {label}
    </button>
  );
}

function Topbar({
  search,
  onSearch,
  genre,
  onGenre,
  status,
  onStatus,
  sort,
  onSort,
  onCreate,
}: {
  search: string;
  onSearch: (v: string) => void;
  genre: Genre | "all";
  onGenre: (g: Genre | "all") => void;
  status: Status | "all";
  onStatus: (s: Status | "all") => void;
  sort: "recent" | "popular";
  onSort: (s: "recent" | "popular") => void;
  onCreate: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-black/60 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm sm:text-base text-zinc-400">Страница историй</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreate}
            className="hidden sm:inline-flex rounded-xl bg-zinc-200 text-black px-3 py-2 text-sm font-medium hover:bg-zinc-100 transition"
          >
            + Создать историю
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* search */}
          <div className="flex-1">
            <label className="sr-only">Поиск</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <IconSearch />
              </span>
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Найти историю…"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </div>
          </div>

          {/* filters */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={genre}
              onChange={(v) => onGenre(v as Genre | "all")}
              label="Жанр"
              options={[["all", "Все жанры"], ...ALL_GENRES.map((g) => [g, g])]}
            />
            <Select
              value={status}
              onChange={(v) => onStatus(v as Status | "all")}
              label="Статус"
              options={[
                ["all", "Все"],
                ["published", "Опубликованные"],
                ["draft", "Черновики"],
                ["archived", "Архив"],
              ]}
            />
            <Select
              value={sort}
              onChange={(v) => onSort(v as "recent" | "popular")}
              label="Сортировать"
              options={[
                ["recent", "Недавние"],
                ["popular", "Популярные"],
              ]}
            />
            <button
              onClick={onCreate}
              className="lg:hidden rounded-xl bg-zinc-200 text-black px-3 py-2 text-sm font-medium hover:bg-zinc-100 transition"
            >
              + Создать
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: [string, string][];
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-xs text-zinc-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
      >
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

function StoryCard({ s }: { s: Story }) {
  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/40 transition overflow-hidden">
      {/* cover */}
      <div className="p-5 pb-0">
        <div className="relative h-40 w-full rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_50%)] ring-1 ring-inset ring-zinc-800/80 overflow-hidden">
          {/* Если будет URL — можно вывести <img src={s.cover} .../> */}
        </div>
      </div>

      {/* content */}
      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span
            className={classNames(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
              GENRE_BADGE[s.genre]
            )}
          >
            {s.genre}
          </span>

        {/* меню действий */}
          <details className="relative">
            <summary className="list-none cursor-pointer rounded-full p-1 text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition">
              <IconDots />
            </summary>
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-1 text-sm shadow-lg">
              <MenuBtn icon={<IconPlay />} label="Играть" />
              <MenuBtn icon={<IconEdit />} label="Редактировать" />
              <MenuBtn icon={<IconDuplicate />} label="Дублировать" />
              <div className="my-1 h-px bg-zinc-800" />
              <MenuBtn icon={<IconArchive />} label="Архивировать" />
              <MenuBtn icon={<IconTrash />} label="Удалить" danger />
            </div>
          </details>
        </div>

        <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2">{s.description}</p>

        <div className="flex items-center gap-2 pt-1">
          <span className={classNames("rounded-full px-2 py-0.5 text-[10px]", STATUS_BADGE[s.status])}>
            {s.status === "published" ? "Опубликовано" : s.status === "draft" ? "Черновик" : "Архив"}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-400">
            <IconUsers /> {s.players.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
            <IconClock /> {s.sessions.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="px-5 pb-4 pt-1 text-[11px] text-zinc-500">
        Обновлено {new Date(s.updatedAt).toLocaleDateString()}
      </div>
    </article>
  );
}

function MenuBtn({
  icon,
  label,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={classNames(
        "w-full inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-zinc-900",
        danger ? "text-red-300 hover:text-red-200" : "text-zinc-200"
      )}
      onClick={(e) => {
        e.preventDefault();
        alert(label);
      }}
    >
      <span className="size-4">{icon}</span>
      {label}
    </button>
  );
}

/* --------------------------------- Страница --------------------------------- */

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [sort, setSort] = useState<"recent" | "popular">("recent");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const data = useMemo(() => {
    let list = SEED.slice();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    if (genre !== "all") list = list.filter((s) => s.genre === genre);
    if (status !== "all") list = list.filter((s) => s.status === status);

    list.sort((a, b) => {
      if (sort === "recent") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      // popular
      const ap = a.players + a.sessions / 2;
      const bp = b.players + b.sessions / 2;
      return bp - ap;
    });

    return list;
  }, [search, genre, status, sort]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const slice = data.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const onCreate = () => alert("Создание новой истории (здесь открой модал/роут)");

  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 md:ml-64">
          <Topbar
            search={search}
            onSearch={setSearch}
            genre={genre}
            onGenre={(g) => {
              setGenre(g);
              setPage(1);
            }}
            status={status}
            onStatus={(s) => {
              setStatus(s);
              setPage(1);
            }}
            sort={sort}
            onSort={setSort}
            onCreate={onCreate}
          />

          {/* контент */}
          <section className="px-4 py-6">
            {slice.length === 0 ? (
              <EmptyState onCreate={onCreate} />
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {slice.map((s) => (
                    <StoryCard key={s.id} s={s} />
                  ))}
                </div>

                {/* пагинация */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    Показано {slice.length} из {data.length}
                  </div>
                  <Pagination
                    page={pageSafe}
                    total={totalPages}
                    onPage={(p) => setPage(p)}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
      <div className="mx-auto mb-3 size-10 text-zinc-500">
        <IconInbox />
      </div>
      <h3 className="text-lg font-semibold">Здесь пока пусто</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Создайте первую историю или измените фильтры.
      </p>
      <div className="mt-4">
        <button
          onClick={onCreate}
          className="rounded-xl bg-zinc-200 text-black px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition"
        >
          + Создать историю
        </button>
      </div>
    </div>
  );
}

function Pagination({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (p: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-40"
        disabled={page <= 1}
      >
        Назад
      </button>
      <span className="px-2 text-xs text-zinc-400">
        стр. {page} / {total}
      </span>
      <button
        onClick={() => onPage(Math.min(total, page + 1))}
        className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-40"
        disabled={page >= total}
      >
        Вперёд
      </button>
    </div>
  );
}

/* ------------------------------- Иконки (SVG) ------------------------------- */

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z" fill="currentColor" />
    </svg>
  );
}
function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M5 11l2-4 2 4 4 2-4 2-2 4-2-4-4-2 4-2zm10-8l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  );
}
function IconBookOpen() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 6c-2-1-6-1-8 1v11c2-2 6-2 8-1V6zm0 0c2-1 6-1 8 1v11c-2-2-6-2-8-1V6z" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M4 19h16v2H4zM6 17h2V9H6zm4 0h2V5h-2zm4 0h2V12h-2z" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M19.4 13a7.7 7.7 0 000-2l2-1.6-2-3.4-2.3.9a7.5 7.5 0 00-1.7-1L13 2h-4l-.4 2.9a7.5 7.5 0 00-1.7 1l-2.3-.9-2 3.4L4.6 11a7.7 7.7 0 000 2L2.3 14.6l2 3.4 2.3-.9a7.5 7.5 0 001.7 1L9 22h4l.4-2.9a7.5 7.5 0 001.7-1l2.3.9 2-3.4L19.4 13zM12 15a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M10 17l1.4-1.4L9.8 14H21v-2H9.8l1.6-1.6L10 9l-4 4 4 4zM4 5h8V3H4a2 2 0 00-2 2v14a2 2 0 002 2h8v-2H4V5z" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M21 21l-4.3-4.3A7.5 7.5 0 1016.7 17L21 21zM5 10.5A5.5 5.5 0 1110.5 16 5.5 5.5 0 015 10.5z" />
    </svg>
  );
}
function IconDots() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M16 11a4 4 0 10-4-4 4 4 0 004 4zM2 20a6 6 0 1112 0v2H2zM18 13a5 5 0 015 5v2h-4v-2a7 7 0 00-3-5z" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h5v-2h-4V7h-2z" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
    </svg>
  );
}
function IconDuplicate() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M8 8h12v12H8zM4 4h12v2H6v10H4z" />
    </svg>
  );
}
function IconArchive() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M20.5 5.5l-2-2h-13l-2 2V8h17V5.5zM4 9v10a2 2 0 002 2h12a2 2 0 002-2V9H4zm5 4h6v2H9v-2z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z" />
    </svg>
  );
}
function IconInbox() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
      <path d="M3 4h18l-2 12H5L3 4zm2 14h14v2H5v-2zm9-6h3l1-6H6l1 6h3a3 3 0 006 0z" />
    </svg>
  );
}