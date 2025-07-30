import { FC } from "react";
import ContentCard from "../ContentCard";

type Props = {
  title?: string;
  description?: string;
};

const TitleCard: FC<Props> = ({ title, description }) => {
  return (
    <div>
      <div className="h-3 bg-[#673ab7] rounded-t-[10px]" />
      <ContentCard className="pt-2 rounded-t-none shadow-none">
        <span className="text-sm text-gray-500">Responses cannot be edited</span>
        <h1 className="text-4xl font-normal my-2">{title}</h1>
        <p className="text-sm">{description}</p>
      </ContentCard>
    </div>
  );
};

export default TitleCard;
