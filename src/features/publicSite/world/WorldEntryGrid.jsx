import StateCard from "../ui/StateCard.jsx";
import WorldEntryCard from "./WorldEntryCard.jsx";

export default function WorldEntryGrid({ entries, emptyMessage }) {
  if (!entries.length) {
    return <StateCard>{emptyMessage}</StateCard>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <WorldEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}