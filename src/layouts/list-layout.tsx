type ListLayoutProps = {
  children: React.ReactNode;
};

export default function ListLayout({ children }: ListLayoutProps) {
  return (
    <div className="mx-auto px-6 py-8 gap-8 max-w-screen-lg">
      <div className="flex flex-col gap-4"> {children}</div>
    </div>
  );
}
