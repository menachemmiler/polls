import React from "react";

interface RawAnswersListData {
  option: string;
  count: number;
}

interface RawAnswersListProps {
  answers: RawAnswersListData[];
}

const RawAnswersList: React.FC<RawAnswersListProps> = ({ answers }) => {
  return (
    <div className="pb-6">
      <ul className="flex flex-col gap-2 my-1">
        {!answers || answers.length === 0 ? (
          <li className="text-gray-400 text-[14px] px-4 py-2 bg-[#e6e3ee] rounded">
            אין תשובות
          </li>
        ) : (
          answers.map((answer, i) => (
            <li
              key={i}
              className="
                  bg-[#f7f9fa]
                  text-[14px]
                  font-[400]
                  text-gray-900
                  px-4
                  py-2
                  rounded-sm
                  select-text
                  whitespace-pre-line
                  transition
                "
            >
              {answer.option}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RawAnswersList;
