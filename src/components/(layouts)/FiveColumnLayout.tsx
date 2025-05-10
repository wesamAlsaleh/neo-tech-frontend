// Widget Card Layout for 5 columns
export const FiveColumnLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{children}</div>;
