import { crownforgeConfig } from "@/config/crownforge.config";
import ContactForm from "@/features/publicSite/sections/Contact/ContactForm.jsx";
import StudioInnerPage from "@/features/publicSite/layout/StudioInnerPage.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";
import { getSiteSettings } from "@/lib/cms/studio.js";

export async function generateMetadata() {
  return getPageMetadata({
    title: "Contact",
    description: crownforgeConfig.pages.contact.description,
    path: "/contact",
  });
}

export const revalidate = 60;

export default async function Page() {
  const settings = await getSiteSettings();
  const social = settings.socialLinks;
  const email = settings.contactEmail;

  return (
    <StudioInnerPage
      copy={crownforgeConfig.pages.contact}
      headingId="contact-page-heading"
      showContactCta={false}
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div>
          <p className="m-0 max-w-[520px] text-ggg-body leading-[1.7] text-ggg-muted">
            {settings.contactText}
          </p>
          {email ? (
            <p className="mt-6 m-0 font-mono text-[12px] tracking-[0.08em] text-ggg-text">
              <a className="border-b border-ggg-accent pb-px hover:text-ggg-accent" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          ) : null}
          {social.length ? (
            <ul className="mt-8 flex flex-wrap gap-4 p-0 m-0 list-none">
              {social.map((link) => (
                <li key={link.id}>
                  <a
                    className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ggg-muted transition-colors hover:text-ggg-accent"
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <ContactForm email={email} categories={settings.contactCategories} />
      </div>
    </StudioInnerPage>
  );
}