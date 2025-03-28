export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container/main mx-6 flex flex-1 flex-col gap-4">
      {children}
    </div>
  );
}
