"use client";

import { useState, useEffect } from "react";

type Reply = {
  id: string;
  text: string;
  timestamp: number;
};

type Question = {
  id: string;
  text: string;
  timestamp: number;
  upvotes: number;
  upvoted: boolean;
  replies: Reply[];
};

type SortMode = "newest" | "most-replied";

const STORAGE_KEY = "uisac_discussions_v1";

function loadQuestions(): Question[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Question[]) : [];
  } catch {
    return [];
  }
}

function saveQuestions(qs: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
  } catch {
    // storage unavailable
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function DiscussionsPage() {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [showAskModal, setShowAskModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [askText, setAskText] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    setQuestions(loadQuestions());
  }, []);

  useEffect(() => {
    if (mounted) saveQuestions(questions);
  }, [questions, mounted]);

  const filtered = questions
    .filter((q) => q.text.toLowerCase().includes(search.toLowerCase()))
    .sort(
      sort === "newest"
        ? (a, b) => b.timestamp - a.timestamp
        : (a, b) => b.replies.length - a.replies.length,
    );

  function submitQuestion() {
    const text = askText.trim();
    if (!text) return;
    setQuestions((prev) => [
      {
        id: uid(),
        text,
        timestamp: Date.now(),
        upvotes: 0,
        upvoted: false,
        replies: [],
      },
      ...prev,
    ]);
    setAskText("");
    setShowAskModal(false);
  }

  function toggleUpvote(id: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              upvotes: q.upvoted ? q.upvotes - 1 : q.upvotes + 1,
              upvoted: !q.upvoted,
            }
          : q,
      ),
    );
  }

  function submitReply(questionId: string) {
    const text = (replyTexts[questionId] ?? "").trim();
    if (!text) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              replies: [
                ...q.replies,
                { id: uid(), text, timestamp: Date.now() },
              ],
            }
          : q,
      ),
    );
    setReplyTexts((prev) => ({ ...prev, [questionId]: "" }));
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#f8f5fd] to-[#ede8f5]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-12">
          {/* Hero */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e9e2f3] px-5 py-2 text-sm font-semibold text-[#6f58a8]">
              <ChatIcon className="h-4 w-4" />
              Anonymous Q&amp;A
            </div>
            <h1 className="text-[2.8rem] font-extrabold leading-tight text-[#2f2147] md:text-[3.5rem]">
              Discussions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
              Ask anything, share experiences — completely anonymous. Your
              questions help the whole community.
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#4e2a84] to-[#6f58a8] px-8 py-4 text-xl font-bold text-white shadow-[0_4px_20px_rgba(78,42,132,0.35)] transition hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(78,42,132,0.45)] active:scale-[0.98]"
            >
              <PlusCircleIcon className="h-6 w-6" />
              Ask Anonymously
            </button>
          </div>

          {/* Search + Sort */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9b8bc4]" />
              <input
                type="text"
                placeholder="Search questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[#d4c7e9] bg-white py-3 pl-12 pr-5 text-base text-[#2f2147] placeholder:text-[#b0a0cc] focus:outline-none focus:ring-2 focus:ring-[#6f58a8]/40"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#d4c7e9] bg-white p-1">
              {(["newest", "most-replied"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={[
                    "rounded-full px-5 py-2 text-sm font-semibold transition",
                    sort === s
                      ? "bg-[#4e2a84] text-white shadow-sm"
                      : "text-[#5b4b78] hover:bg-[#e9e2f3]",
                  ].join(" ")}
                >
                  {s === "newest" ? "Newest" : "Most Replied"}
                </button>
              ))}
            </div>
          </div>

          {/* Questions feed */}
          <div className="mt-8 space-y-4">
            {!mounted ? (
              <div className="py-20" />
            ) : filtered.length === 0 ? (
              <EmptyState
                search={search}
                onAsk={() => setShowAskModal(true)}
              />
            ) : (
              filtered.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  expanded={expandedId === q.id}
                  onToggleExpand={() =>
                    setExpandedId(expandedId === q.id ? null : q.id)
                  }
                  onToggleUpvote={() => toggleUpvote(q.id)}
                  replyText={replyTexts[q.id] ?? ""}
                  onReplyTextChange={(v) =>
                    setReplyTexts((prev) => ({ ...prev, [q.id]: v }))
                  }
                  onSubmitReply={() => submitReply(q.id)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Ask Modal */}
      {showAskModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAskModal(false)
          }
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9e2f3] text-[#4e2a84]">
                <ChatIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#2f2147]">
                  Ask Anonymously
                </h2>
                <p className="text-sm text-[#9b8bc4]">
                  No name, no judgement
                </p>
              </div>
            </div>
            <textarea
              autoFocus
              placeholder="What's on your mind? Ask anything about student life, immigration, academics…"
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                  submitQuestion();
              }}
              rows={5}
              className="mt-5 w-full resize-none rounded-2xl border border-[#d4c7e9] bg-[#f8f5fd] p-4 text-base text-[#2f2147] placeholder:text-[#b0a0cc] focus:outline-none focus:ring-2 focus:ring-[#6f58a8]/40"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAskModal(false);
                  setAskText("");
                }}
                className="rounded-full px-6 py-3 text-base font-semibold text-[#5b4b78] transition hover:bg-[#e9e2f3]"
              >
                Cancel
              </button>
              <button
                onClick={submitQuestion}
                disabled={!askText.trim()}
                className="rounded-full bg-gradient-to-r from-[#4e2a84] to-[#6f58a8] px-6 py-3 text-base font-bold text-white transition disabled:opacity-40 hover:shadow-[0_4px_16px_rgba(78,42,132,0.35)]"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuestionCard({
  question,
  expanded,
  onToggleExpand,
  onToggleUpvote,
  replyText,
  onReplyTextChange,
  onSubmitReply,
}: {
  question: Question;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleUpvote: () => void;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  onSubmitReply: () => void;
}) {
  return (
    <article className="rounded-3xl border border-[#d4c7e9] bg-white shadow-sm transition hover:shadow-md">
      <button className="w-full p-6 text-left" onClick={onToggleExpand}>
        <p className="text-lg font-semibold leading-snug text-[#2f2147]">
          {question.text}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#9b8bc4]">
          <span className="flex items-center gap-1.5">
            <ReplyIcon className="h-4 w-4" />
            {question.replies.length}{" "}
            {question.replies.length === 1 ? "reply" : "replies"}
          </span>
          <span>{formatTime(question.timestamp)}</span>
          <span className="ml-auto text-xs text-[#b0a0cc]">
            {expanded ? "▲ hide replies" : "▼ show replies"}
          </span>
        </div>
      </button>

      <div className="flex items-center border-t border-[#f0ebf7] px-6 py-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleUpvote();
          }}
          className={[
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition",
            question.upvoted
              ? "bg-[#4e2a84] text-white"
              : "bg-[#f0ebf7] text-[#6f58a8] hover:bg-[#e9e2f3]",
          ].join(" ")}
        >
          <ArrowUpIcon className="h-4 w-4" />
          {question.upvotes > 0 ? question.upvotes : "Upvote"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#f0ebf7] px-6 pb-6 pt-4">
          {question.replies.length === 0 ? (
            <p className="mb-4 text-sm italic text-[#b0a0cc]">
              No replies yet — be the first to respond!
            </p>
          ) : (
            <div className="mb-4 space-y-3">
              {question.replies.map((r) => (
                <div key={r.id} className="rounded-2xl bg-[#f8f5fd] px-4 py-3">
                  <p className="text-sm leading-relaxed text-[#2f2147]">
                    {r.text}
                  </p>
                  <p className="mt-1 text-xs text-[#b0a0cc]">
                    {formatTime(r.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Reply anonymously…"
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmitReply()}
              className="flex-1 rounded-full border border-[#d4c7e9] bg-[#f8f5fd] px-5 py-2.5 text-sm text-[#2f2147] placeholder:text-[#b0a0cc] focus:outline-none focus:ring-2 focus:ring-[#6f58a8]/40"
            />
            <button
              onClick={onSubmitReply}
              disabled={!replyText.trim()}
              className="rounded-full bg-[#4e2a84] px-5 py-2.5 text-sm font-bold text-white transition disabled:opacity-40 hover:bg-[#6f58a8]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function EmptyState({
  search,
  onAsk,
}: {
  search: string;
  onAsk: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#e9e2f3] text-[#9b8bc4]">
        <ChatIcon className="h-12 w-12" />
      </div>
      {search ? (
        <>
          <h3 className="text-2xl font-extrabold text-[#2f2147]">
            No questions match &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-lg text-[#9b8bc4]">
            Try a different search, or be the first to ask it!
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-extrabold text-[#2f2147]">
            No questions yet
          </h3>
          <p className="mt-2 text-lg text-[#9b8bc4]">
            Be the first to start a discussion!
          </p>
        </>
      )}
      <button
        onClick={onAsk}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4e2a84] to-[#6f58a8] px-7 py-3.5 text-base font-bold text-white shadow-[0_4px_16px_rgba(78,42,132,0.3)] transition hover:scale-[1.02]"
      >
        <PlusCircleIcon className="h-5 w-5" />
        Ask the First Question
      </button>
    </div>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
