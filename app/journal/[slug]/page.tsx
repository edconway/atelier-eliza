import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, journalPosts } from "@/lib/journal";
import { NewsletterForm } from "@/components/journal/newsletter-form";

export async function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Letter" };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/journal" className="hover:text-gold-ink">
          Journal
        </Link>{" "}
        · {post.topic} · {post.date}
      </p>
      <h1 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
      <div className="mt-10 space-y-5 text-[1.05rem] leading-8">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-14 rounded-2xl border bg-card p-5">
        <p className="font-heading text-xl">Receive the next letter</p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </article>
  );
}
