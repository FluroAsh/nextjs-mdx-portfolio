import Link from "next/link";

export default async function Home() {
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 max-w-xl">
      <h1 className="text-2xl font-bold pb-8">Home Page</h1>

      <section className="grid ">
        <h1 className="font-bold">Section 1</h1>
        <Link href="/blog">Blog</Link>
        <Link href="blog/test">Test Post</Link>
      </section>
    </div>
  );
}
