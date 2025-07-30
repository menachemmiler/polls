import { Pie, Cell, PieProps } from "recharts";

interface PieLayerProps extends PieProps {
  data: { option: string; count: number }[];
  colors: string[];
  getCellProps?: (
    idx: number,
    entry: { option: string; count: number }
  ) => React.ComponentProps<typeof Cell>;
}

const PieLayer: React.FC<PieLayerProps> = ({
  data,
  colors,
  getCellProps = () => ({}),
  children,
  ...rest
}) => (
  <Pie isAnimationActive={false} data={data} {...rest}>
    {data.map((entry, idx) => (
      <Cell
        key={entry.option || idx}
        fill={colors[idx % colors.length]}
        {...getCellProps(idx, entry)}
      />
    ))}
    {children}
  </Pie>
);

export default PieLayer;
