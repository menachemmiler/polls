import { FC } from "react";

interface CustomRadioProps {
  checked: boolean;
}

const CustomRadio: FC<CustomRadioProps> = ({ checked }) => {
  return (
    <span
      className={[
        "inline-block w-5.5 h-5.5 rounded-full relative mr-2 box-border transition-colors duration-200",
        checked
          ? "border-2 border-[#4d2b87] bg-[#ede7f6]"
          : "border-2 border-[#c7c7c7] bg-white",
      ].join(" ")}
    >
      {checked && (
        <span className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-[#4d2b87] transition-colors duration-200" />
      )}
    </span>
  );
};

export default CustomRadio;
