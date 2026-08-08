import type { Metadata } from "next";

// Loan-journey utility page (linked from client emails) - noindex.

export const metadata: Metadata = {
  title: 'Formal Approval',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main>
      <article className="container-x max-w-3xl pb-20 pt-12">
        <div className="prose-post" dangerouslySetInnerHTML={{ __html: '\n\n\t<a href="https://bit.ly/link-advance" target="_self" role="button" aria-label="Leave us a Google review">\n\t\t\t\t\t\tLeave us a Google review\n\t\t\t\t\t</a>\n\t\t<iframe loading="lazy" src="https://player.vimeo.com/video/1024748629?h=8bc34e4107&amp;title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="LV #5 Formal Approval"></iframe>\t\n\n' }} />
      </article>
    </main>
  );
}
