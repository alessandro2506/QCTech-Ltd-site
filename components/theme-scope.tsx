export function ThemeScope({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light flex min-h-full flex-1 flex-col bg-[var(--light-bg)] text-[var(--light-text)]">
      {children}
    </div>
  );
}
