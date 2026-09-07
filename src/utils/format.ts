const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthName(m: string | number): string {
  const i = Number(m) - 1;
  return MONTHS[i] || "";
}

export function fmtYM(ym: string | null | undefined): string {
  if (!ym) return "";
  const parts = String(ym).split("-");
  if (parts.length < 2) return String(ym);
  const [y, m] = parts;
  const mon = monthName(m as string);
  return mon ? `${mon} ${y}` : String(ym);
}

export function fmtRange(startYM?: string | null, endYM?: string | null): string {
  const a = fmtYM(startYM);
  const b = endYM ? fmtYM(endYM) : "Present";
  if (!a && !b) return "";
  if (!a) return b;
  return `${a} – ${b}`;
}

export function sortableYM(ym: string | null | undefined): string {
  if (!ym) return "";
  const parts = String(ym).split("-");
  if (parts.length < 2) return String(ym);
  const [y, m] = parts;
  return `${y}-${(m as string).padStart(2, "0")}`;
}
