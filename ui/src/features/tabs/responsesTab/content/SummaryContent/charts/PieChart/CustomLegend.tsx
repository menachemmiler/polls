import { FC } from "react";

interface LegendPayloadEntry {
  value: string;
  color?: string;
  [key: string]: unknown;
}

interface CustomLegendProps {
  payload?: LegendPayloadEntry[];
  onItemHover?: (option: string | null) => void;
  onItemClick?: (option: string | null) => void;
  optionToIndex?: Map<string, number>;
  selectedOption?: string;
}

const CustomLegend: FC<CustomLegendProps> = (props) => {
  const { payload = [], onItemHover, onItemClick, selectedOption } = props;

  const unique = Array.from(
    new Map(payload.map((entry) => [entry.value, entry])).values()
  );

  return (
    <ul className="space-y-1 ml-3">
      {unique.map((entry) => (
        <li
          key={`item-${entry.value}`}
          className="flex items-center cursor-pointer group"
          onMouseEnter={() => onItemHover?.(entry.value)}
          onMouseLeave={() => onItemHover?.(null)}
          onClick={() => onItemClick?.(entry.value)}
          style={{
            fontWeight: entry.value === selectedOption ? 600 : 400,
          }}
        >
          <span className="text-black text-[13px] font-normal">
            {entry.value}
          </span>
          <span
            className="inline-block rounded-full mr-2 border"
            style={{
              width: 14,
              height: 14,
              background: entry.color || "#ccc",
              borderWidth: entry.value === selectedOption ? 3 : 0,
              borderColor: entry.color,
              transition: "border-width 120ms",
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
