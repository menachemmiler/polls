import { useEffect, useState } from "react";

interface SpinnerProps {
  show: boolean;
  minDuration?: number; // ברירת מחדל 500ms
}

const Spinner = ({ show, minDuration = 10000 }: SpinnerProps) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (show) {
      setVisible(true);
    } else if (visible) {
      timeout = setTimeout(() => setVisible(false), minDuration);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [show]);

  return visible ? (
    <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  ) : null;
};

export default Spinner;
