import React, { useState } from "react";

type DotProps = { cx: number; cy: number; r?: number };

const Dot: React.FC<DotProps> = ({ cx, cy, r = 2.3 }) => (
  <circle cx={cx} cy={cy} r={r} fill="#5f6368" />
);

const MenuDots: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        className={[
          "rounded-full transition-colors",
          hover && !active ? "bg-gray-300" : "",
          active ? "bg-gray-400" : "",
        ].join(" ")}
        style={{
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setActive(false);
        }}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onClick={onClick}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Dot cx={12} cy={5} />
          <Dot cx={12} cy={12} />
          <Dot cx={12} cy={19} />
        </svg>
      </button>
      {hover && (
        <span
          className="
      absolute left-1/2 top-full mt-1
      -translate-x-1/2
      bg-gray-500 text-white
      px-2 py-0.5
      text-[8px] 
      shadow-sm z-50
      whitespace-nowrap
      pointer-events-none
      select-none
      border-none
      rounded-none
    "
        >
          More options for responses
        </span>
      )}
    </div>
  );
};

export default MenuDots;
