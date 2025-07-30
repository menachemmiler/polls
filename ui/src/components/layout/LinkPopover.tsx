interface Props {
  pollId: string;
  isPublished: boolean;
  onClose?: () => void;
  onCopy?: () => void;
}

const UnpublishedLinkPopover: React.FC<Props> = ({
  pollId,
  isPublished,
  onClose,
  onCopy,
}) => {
  const link = `${window.location.origin}/response/${pollId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    onCopy?.();
    onClose?.();
  };

  return (
    <>
      {isPublished ? (
        <div
          className="absolute top-full left-0 mt-2 z-50 w-80 bg-white shadow-md border rounded p-4 text-sm text-gray-800"
          dir="rtl"
        >
          <p className="font-semibold mb-3">העתקת הקישור של המשיב/ה</p>

          <input
            type="text"
            value={link}
            readOnly
            onFocus={(e) => e.target.select()}
            className="w-full border rounded px-3 py-2 text-left text-sm text-gray-700 bg-gray-100"
          />

          <div className="flex justify-end">
            <button
              className="mt-3 ml-3 text-gray-600 hover: cursor-pointer"
              onClick={onClose}
            >
              סגור
            </button>
            <button
              className="mt-3 text-blue-600 hover:underline cursor-pointer"
              onClick={handleCopy}
            >
              העתקה
            </button>
          </div>
        </div>
      ) : (
        <div
          className="absolute top-full left-0 mt-2 z-50 w-72 bg-white shadow-md border rounded p-4 text-sm text-gray-800"
          dir="rtl"
        >
          <p className="font-semibold mb-1">הפרסום של הטופס בוטל</p>
          <p className="mb-3">
            כרגע אף אחד לא יכול להגיב. רוצה להעתיק את הקישור לטופס שלא פורסם?
          </p>
          <div className="flex justify-end">
            <button
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={handleCopy}
            >
              העתקה
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default UnpublishedLinkPopover;
