export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto px-6 py-8 gap-8 max-w-screen-lg">
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};
