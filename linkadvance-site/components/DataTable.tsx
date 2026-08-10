// A crawlable data table for the tool pages: the pre-computed figures that
// win featured snippets, generated from the same maths the interactive
// calculator runs so the page never disagrees with its own tool.

export function DataTable({
  caption,
  head,
  rows,
  note,
}: {
  caption?: string;
  head: string[];
  rows: (string | number)[][];
  note?: string;
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[15px]">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b-2 border-advance text-xs font-semibold uppercase tracking-wider text-ink/50">
              {head.map((h, i) => (
                <th key={h} className={`py-3 pr-3 ${i > 0 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-b border-ink/10">
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className={`py-3 pr-3 tabular-nums ${
                      ci === 0 ? "font-semibold text-ink" : "text-right text-ink/75"
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-3 text-xs text-ink/45">{note}</p>}
    </div>
  );
}
