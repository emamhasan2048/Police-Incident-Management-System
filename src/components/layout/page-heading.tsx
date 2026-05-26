export function PageHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>}
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">{title}</h1>
    </div>
  );
}

