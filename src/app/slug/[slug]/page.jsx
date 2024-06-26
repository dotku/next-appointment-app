export default function Page({ params }) {
  return <div>My Post 002: {params.slug.slice(3)}</div>;
}
