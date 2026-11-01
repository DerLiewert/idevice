type PageHeaderProps = {
  title: string;
  description?: string;
};

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="container mb-7.5!">
      <h2 className="text-3xl">{title}</h2>
      <p className="text-muted-foreground text-sm mt-3 ">{description}</p>
    </div>
  );
};
