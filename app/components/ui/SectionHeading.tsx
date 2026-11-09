import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
};

export default function SectionHeading({ title, subtitle, href, linkLabel = "View all" }: Props) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-2xl font-bold uppercase text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-ink underline-offset-4 hover:text-brand-dark hover:underline"
        >
          {linkLabel} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}