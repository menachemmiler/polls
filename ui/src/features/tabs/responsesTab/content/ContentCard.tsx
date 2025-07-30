import { FC, ReactNode } from "react";

interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

const ContentCard: FC<ContentCardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={[
        "bg-white rounded-lg px-6 py-6 w-full mb-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export default ContentCard;
