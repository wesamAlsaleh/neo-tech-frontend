// Widget Card Layout for 2 columns
export const TwoColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{children}</div>;
