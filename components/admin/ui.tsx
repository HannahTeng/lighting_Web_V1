import Link from "next/link";
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

/* ── Buttons (class helpers) ─────────────────────────────── */

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-ink text-bg font-mono text-[10.5px] tracking-[0.16em] uppercase hover:bg-[#2a2925] transition-colors disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-line text-ink-soft font-mono text-[10.5px] tracking-[0.16em] uppercase hover:bg-sand/30 hover:text-ink transition-colors";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 px-3 py-2 rounded-sm border border-line text-ink-soft font-mono text-[10px] tracking-[0.14em] uppercase hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors";

/* ── Page header ─────────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-[32px] leading-none tracking-[0.01em]">{title}</h1>
        {subtitle && (
          <p className="mt-2 font-mono text-[10.5px] tracking-[0.12em] uppercase text-ink-soft">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────── */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-line rounded-md ${className}`}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-stone">{label}</div>
      <div className="mt-2 font-serif text-[34px] leading-none tabular-nums">{value}</div>
      {hint && <div className="mt-1.5 font-mono text-[10px] text-ink-soft">{hint}</div>}
    </Card>
  );
}

/* ── Badge ───────────────────────────────────────────────── */

const BADGE_TONES: Record<string, string> = {
  neutral: "bg-sand/40 text-ink-soft",
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  ink: "bg-ink text-bg",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES | string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[9px] tracking-[0.12em] uppercase ${
        BADGE_TONES[tone] ?? BADGE_TONES.neutral
      }`}
    >
      {children}
    </span>
  );
}

/* ── Table ───────────────────────────────────────────────── */

export function Table({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">{children}</table>
      </div>
    </Card>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 border-b border-line font-mono text-[9px] tracking-[0.16em] uppercase text-stone font-normal ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 border-b border-line-soft text-[13px] align-middle ${className}`}>
      {children}
    </td>
  );
}

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center font-mono text-[10.5px] tracking-[0.14em] uppercase text-stone"
      >
        {label}
      </td>
    </tr>
  );
}

/* ── Form fields ─────────────────────────────────────────── */

export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block mb-1.5 font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-soft">
        {label}
      </span>
      {children}
      {hint && <span className="block mt-1 font-mono text-[9.5px] text-stone">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full px-3 py-2.5 rounded-sm bg-bg-alt border border-line text-[13px] text-ink outline-none focus:border-ink/40 transition-colors";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y min-h-24 ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

/* ── Link button ─────────────────────────────────────────── */

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link href={href} className={variant === "ghost" ? btnGhost : btnPrimary}>
      {children}
    </Link>
  );
}
