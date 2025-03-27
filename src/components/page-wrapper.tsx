export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 mx-6">
      {children}
    </div>
  );
}