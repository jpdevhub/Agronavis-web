'use client';

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3"
    >
      <input
        type="email"
        required
        placeholder="you@yourfarm.com"
        aria-label="Email address"
        className="min-w-[240px] flex-1 rounded-full border border-hairline-strong bg-raised px-5 py-3.5 text-[0.9375rem] text-ink placeholder:text-ink-faint focus:border-accent-line focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-6 py-3.5 text-[0.9375rem] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        Subscribe
      </button>
    </form>
  );
}
