import React from "react";
import ContentCard from "../ContentCard";

type RespondersListProps = {
  responders: { respondentId: string; mail: string; name: string }[];
  onResponderSelect?: (idx: number) => void;
};

const RespondersList: React.FC<RespondersListProps> = ({
  responders,
  onResponderSelect,
}) => (
  <ContentCard className="pt-6 pb-6 px-6">
    <div>
      <div className="text-[22px] font-[400] text-gray-900 mb-2">מי הגיב?</div>
      <div className="border-b border-gray-400 mb-4" />
      <div className="text-[17px] text-gray-700 mb-2 font-[400]">אימייל</div>
      <ul className="flex flex-col gap-2 my-1">
        {responders.map((responder, idx) => (
          <li
            key={responder.respondentId}
            className="
              bg-[#f7f9fa]
              rounded-sm
              hover:bg-[#ebeef2]
              text-[14px]
              font-[400]
              text-gray-900
              cursor-pointer
              px-4
              py-2
              transition
            "
            onClick={() => onResponderSelect?.(idx)}
          >
            {responder.mail || responder.name || `responder ${idx + 1}`}
          </li>
        ))}
      </ul>
    </div>
  </ContentCard>
);

export default RespondersList;
