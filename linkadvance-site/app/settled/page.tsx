import type { Metadata } from "next";

// Loan-journey utility page (linked from client emails) - noindex.

export const metadata: Metadata = {
  title: 'Settled',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main>
      <article className="container-x max-w-3xl pb-20 pt-12">
        <div className="prose-post" dangerouslySetInnerHTML={{ __html: '\n\n\t\t<iframe loading="lazy" src="https://player.vimeo.com/video/1024748740?h=5163813d21&amp;title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="LV #6 Settled"></iframe>\t\n\n' }} />
      </article>
    </main>
  );
}
