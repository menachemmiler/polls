import { FC } from 'react'
interface CopyChartBtnProps {
  onCopyChart?: () => void;
  btnId?: string;
}

const CopyChartBtn: FC<CopyChartBtnProps> = ({ onCopyChart, btnId }) => {
  return (
    <button
      type="button"
      id={btnId} 
      className="flex items-center gap-1 px-4 bg-[#f8fafd] text-[#1967d2] text-[16px] font-medium transition hover:bg-[#eae5f7]"
      onClick={onCopyChart}
    >
      <svg
        className="w-9 h-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        viewBox="0 0 24 24"
      >
        <rect
          x="12"
          y="5"
          width="7"
          height="9"
          stroke="currentColor"
          fill="none"
        />
        <svg>
          <line x1="9" y1="7" x2="9" y2="17" stroke="currentColor" />
          <line x1="9" y1="17" x2="18" y2="17" stroke="currentColor" />
        </svg>
      </svg>
      העתקת התרשים
    </button>
  )
}

export default CopyChartBtn