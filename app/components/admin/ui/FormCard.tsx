import type { ReactNode } from "react";

type Props = { title: string; description?: string; children: ReactNode };

export default function FormCard({ title, description, children }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold uppercase text-ink">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}