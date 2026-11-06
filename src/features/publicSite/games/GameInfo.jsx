import PageContainer from "../ui/PageContainer.jsx";
import SectionHeading from "../shared/SectionHeading/SectionHeading.jsx";

function infoRows(game) {
  const rows = [];
  if (game.status) rows.push({ label: "Development status", value: game.status });
  if (game.genre?.trim()) rows.push({ label: "Genre", value: game.genre });
  if (game.platforms?.length) rows.push({ label: "Platforms", value: game.platforms.join(", ") });
  if (game.release?.trim()) rows.push({ label: "Release", value: game.release });
  if (game.developer?.trim()) rows.push({ label: "Developer", value: game.developer });
  return rows;
}

export default function GameInfo({ game }) {
  const rows = infoRows(game);
  const description = game.description?.trim();
  if (!description && !rows.length) return null;

  return (
    <PageContainer as="section" className="py-12 sm:py-16">
      {description ? (
        <SectionHeading eyebrow="About" title={game.title} body={description} />
      ) : (
        <SectionHeading eyebrow="Details" title={game.title} />
      )}
      {rows.length ? (
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="border-t border-ggg-border pt-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ggg-accent">{row.label}</dt>
              <dd className="mt-2 m-0 text-ggg-body text-ggg-text">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </PageContainer>
  );
}
