const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export type Opening = {
  title: string;
  team: string | null;
  location: string;
  commitment: string;
  stipend_min: number | null;
  stipend_max: number | null;
  summary: string | null;
};

/** Shown if the API is unreachable at build time, so the page always renders. */
const FALLBACK: Opening[] = [
  { title: 'AI / ML Engineer', team: 'Intelligence', location: 'Remote or Bengaluru', commitment: 'Internship', stipend_min: 3000, stipend_max: 4500, summary: 'Crop and moisture models over Sentinel imagery.' },
  { title: 'Backend Engineer', team: 'Platform', location: 'Remote', commitment: 'Internship', stipend_min: 2500, stipend_max: 4000, summary: 'Ingest pipelines and the APIs that serve them.' },
  { title: 'Frontend Engineer', team: 'Product', location: 'Remote', commitment: 'Internship', stipend_min: 2500, stipend_max: 4000, summary: 'The interfaces farmers and institutions actually use.' },
  { title: 'Product Engineer', team: 'Product', location: 'Remote or Bengaluru', commitment: 'Internship', stipend_min: 2500, stipend_max: 4000, summary: 'End to end features, from the field problem to the shipped screen.' },
  { title: 'Geospatial Analyst', team: 'Intelligence', location: 'Bengaluru', commitment: 'Internship', stipend_min: 2000, stipend_max: 3500, summary: 'Remote sensing, GIS layers and ground truth.' },
  { title: 'Marketing and Growth', team: 'Growth', location: 'Remote', commitment: 'Internship', stipend_min: 1500, stipend_max: 3000, summary: 'Reaching farmers in the languages and places they already are.' },
  { title: 'Design', team: 'Product', location: 'Remote', commitment: 'Internship', stipend_min: 2000, stipend_max: 3500, summary: 'Interfaces that work on a cheap phone in bright sunlight.' },
  { title: 'Field Operations', team: 'Field', location: 'Pune or Nashik', commitment: 'Internship', stipend_min: 1500, stipend_max: 3000, summary: 'Time on real farms, turning what you see into product decisions.' },
];

export async function getOpenings(): Promise<Opening[]> {
  try {
    const response = await fetch(`${API_URL}/api/openings`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return FALLBACK;
    const data = (await response.json()) as { openings?: Opening[] };
    return data.openings?.length ? data.openings : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export const formatStipend = (o: Opening): string | null => {
  const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  if (o.stipend_min && o.stipend_max) return `${money(o.stipend_min)} – ${money(o.stipend_max)}`;
  if (o.stipend_min) return `From ${money(o.stipend_min)}`;
  if (o.stipend_max) return `Up to ${money(o.stipend_max)}`;
  return null;
};

/** The advertised band across every open role. */
export function stipendRange(openings: Opening[]): string | null {
  const lows = openings.map((o) => o.stipend_min).filter((n): n is number => typeof n === 'number');
  const highs = openings.map((o) => o.stipend_max).filter((n): n is number => typeof n === 'number');
  if (!lows.length || !highs.length) return null;
  const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  return `${money(Math.min(...lows))} – ${money(Math.max(...highs))}`;
}
