type SectionHeadingProps = {
  kicker?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

export function SectionHeading({ kicker, title, copy, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {kicker ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-[var(--cj-orange)]">{kicker}</p>
      ) : null}
      <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--cj-cream)] sm:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 text-pretty text-base leading-8 text-[var(--cj-cream)]/78 sm:text-lg">{copy}</p> : null}
    </div>
  );
}
