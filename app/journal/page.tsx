import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts } from "@/lib/journal";
import { NewsletterForm } from "@/components/journal/newsletter-form";

export const metadata: Metadata = {
  title: "Journal",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="mt-4 font-heading text-5xl tracking-tight">Journal</h1>
      <div className="mt-10 max-w-lg rounded-2xl border bg-card p-5">
        <p className="font-heading text-xl">Join the list</p>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">
          Occasional emails. You can unsubscribe.
        </p>
        <NewsletterForm />
      </div>
      <div className="mt-12 space-y-6">
        {journalPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="block rounded-2xl border bg-card p-6 transition hover:border-gold"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {post.topic} · {post.minutes} min · {post.date}
            </p>
            <h2 className="mt-2 font-heading text-3xl">{post.title}</h2>
            <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
