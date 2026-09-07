const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function monthName(m) {
    const i = Number(m) - 1;
    return MONTHS[i] || "";
}
export function fmtYM(ym) {
    if (!ym)
        return "";
    const parts = String(ym).split("-");
    if (parts.length < 2)
        return String(ym);
    const [y, m] = parts;
    const mon = monthName(m);
    return mon ? `${mon} ${y}` : String(ym);
}
export function fmtRange(startYM, endYM) {
    const a = fmtYM(startYM);
    const b = endYM ? fmtYM(endYM) : "Present";
    if (!a && !b)
        return "";
    if (!a)
        return b;
    return `${a} – ${b}`;
}
export function sortableYM(ym) {
    if (!ym)
        return "";
    const parts = String(ym).split("-");
    if (parts.length < 2)
        return String(ym);
    const [y, m] = parts;
    return `${y}-${m.padStart(2, "0")}`;
}
