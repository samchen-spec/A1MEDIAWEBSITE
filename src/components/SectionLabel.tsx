export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block uppercase text-accent font-semibold text-xs tracking-[0.15em] font-sans">
      {children}
    </span>
  );
}
