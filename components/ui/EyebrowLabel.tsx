export default function EyebrowLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-accent ${className}`}>
      {children}
    </p>
  );
}
