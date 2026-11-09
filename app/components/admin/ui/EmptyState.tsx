import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = { Icon: LucideIcon; title: string; text?: string; action?: ReactNode };

export default function EmptyState({ Icon, title, text, action }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-light text-ink">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}