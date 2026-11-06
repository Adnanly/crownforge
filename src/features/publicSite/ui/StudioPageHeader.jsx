import Link from "next/link";

const StudioPageHeader = ({
  backHref = "/",
  backLabel = "Back to home",
  titleLead,
  titleAccent,
  body,
  headingId,
}) => (
  <header className="pb-[clamp(12px,1.8vw,20px)] pt-[calc(60px+clamp(18px,2.4vw,34px))]">
    <Link
      className="mb-5 inline-flex items-center gap-2 text-xs font-medium tracking-[0.02em] text-ggg-muted transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ggg-accent sm:mb-[clamp(20px,2.8vw,34px)] sm:text-ggg-body-sm"
      href={backHref}
    >
      <span aria-hidden className="text-base leading-none sm:text-lg">
        ←
      </span>
      <span>{backLabel}</span>
    </Link>

    <div className="flex max-w-[720px] flex-col items-start">
      <h1
        className="m-0 font-bebas text-[clamp(38px,8vw,80px)] font-bold uppercase leading-[0.88] tracking-[0.005em] text-white [font-synthesis:weight_style]"
        id={headingId}
      >
        {titleLead} {titleAccent ? <span className="text-ggg-accent">{titleAccent}</span> : null}
      </h1>
      {body ? (
        <p className="mt-6 max-w-[560px] text-ggg-body leading-[1.7] text-ggg-muted">{body}</p>
      ) : null}
    </div>
  </header>
);

export default StudioPageHeader;
