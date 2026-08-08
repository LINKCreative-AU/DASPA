// Visible breadcrumb trail matching the BreadcrumbList schema already on these pages.
export function Breadcrumbs({ crumbs }: { crumbs: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink/45">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink/75">
                  {c.name}
                </span>
              ) : (
                <>
                  <a href={c.path} className="transition hover:text-ink">
                    {c.name}
                  </a>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
