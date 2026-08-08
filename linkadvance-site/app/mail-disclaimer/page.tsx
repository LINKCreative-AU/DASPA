import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Compliance content carried VERBATIM from the old site - do not reword
// without licensee sign-off.

export const metadata: Metadata = {
  title: 'E-mail Disclaimer',
  description: "LINK Advance's e-mail disclaimer.",
  alternates: { canonical: '/mail-disclaimer' },
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: 'E-mail Disclaimer', path: '/mail-disclaimer' }]} />
      <article className="container-x max-w-3xl pb-20 pt-8">
        <h1 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">E-mail Disclaimer</h1>
        <div className="prose-post mt-8" dangerouslySetInnerHTML={{ __html: '\n\n\t<h1>E-mail<br />\ndisclaimer.</h1>\n\t<p>The received e-mail, together with any attachment, is intended for the use of the person to whom it is addressed and contains information that is privileged and confidential. If you are not the intended recipient, or the employee or agent responsible for its delivery to the intended recipient, you are hereby notified that any dissemination, distribution or copying of it is strictly prohibited. Please notify us if you have received it in error, and otherwise take all necessary steps to delete it from any transient or permanent storage device or medium and notify us by return email or by telephone. Any views expressed in the received email and any files transmitted with it are those of the individual sender, except where the sender specifically states them to be the views of our business. We do not represent or warrant that the attached files are free from computer viruses or other defects. The user assumes all responsibility for any loss or damage resulting directly or indirectly from the use of any attached files.</p>\n<p>We are committed to protecting your privacy. We may use the information you provide to assist you with your credit needs, including the preparation and submission of loan applications.</p>\n\t<p>We also use it to send you product information and promotional material. From time to time this will include direct marketing communications but we will always give you the option of not receiving these communications.We provide your information to our credit licensee (Connective Credit Services Pty Ltd ABN 51 143 651 496) and the companies with whom you choose to deal (and their representatives). We may also provide your information to contractors who supply services to us (e.g. to handle mailings on our behalf), and to others if we are required to do so by law. We do not rent or sell your information.</p>\n\n\n' }} />
      </article>
    </main>
  );
}
