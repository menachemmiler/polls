import { FC } from "react";

export const AnswerFooter: FC<{ count: number }> = ({ count }) => (
  <div className="mt-1 text-xs text-[#1a73e8] font-normal border-t border-gray-300 pt-2">
    {count === 1 ? "1 response" : `${count} responses`}
  </div>
);
