import PublicPageShell from "./PublicPageShell.jsx";
import StudioPageHeader from "../ui/StudioPageHeader.jsx";
import PageContainer from "../ui/PageContainer.jsx";
import ContactCta from "../sections/ContactCta/ContactCta.jsx";

export default function StudioInnerPage({
  copy,
  headingId,
  children,
  showContactCta = true,
}) {
  return (
    <PublicPageShell>
      <PageContainer as="main" id="main-content" className="block">
        <StudioPageHeader
          backHref="/"
          backLabel={copy.backLabel}
          titleLead={copy.titleLead}
          titleAccent={copy.titleAccent}
          body={copy.body}
          headingId={headingId}
        />
        <div className="mb-[clamp(28px,4vw,40px)] h-px w-full bg-ggg-border" role="presentation" aria-hidden />
        <div className="pb-[clamp(56px,8vw,88px)] pt-0">{children}</div>
      </PageContainer>
      {showContactCta ? <ContactCta /> : null}
    </PublicPageShell>
  );
}
