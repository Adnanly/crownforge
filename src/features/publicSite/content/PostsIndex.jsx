import NewsCard from "../sections/news/NewsCard.jsx";
import StateCard from "../ui/StateCard.jsx";

export default function PostsIndex({ posts, variant, emptyMessage }) {
  if (!posts.length) {
    return <StateCard>{emptyMessage}</StateCard>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <NewsCard key={post.id} post={post} variant={variant} />
      ))}
    </div>
  );
}
