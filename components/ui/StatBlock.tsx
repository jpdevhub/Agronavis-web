export default function StatBlock({
  value,
  label,
  note,
  accent = false,
}: {
  value: string;
  label: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className={`type-stat ${accent ? 'text-accent' : 'text-ink'}`}>{value}</div>
      <div className="mt-2 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">{label}</div>
      {note && <p className="mt-2 text-sm font-light text-ink-muted">{note}</p>}
    </div>
  );
}
