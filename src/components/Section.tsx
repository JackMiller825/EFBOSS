import type { ReactNode } from "react";

type Tone = "navy" | "charcoal" | "light";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = "navy",
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  tone?: Tone;
  children: ReactNode;
}) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className={`section section-${tone}`} aria-labelledby={titleId}>
      <div className="wrap">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={titleId}>{title}</h2>
        {intro ? <div className="section-intro">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}
