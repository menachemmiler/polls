import { useTranslation } from "react-i18next";
const ExportModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}> = ({ open, onClose, onExportExcel, onPrint }) => {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-80 p-6 flex flex-col gap-4">
        <div className="text-lg font-semibold mb-2 text-center">
          ייצוא / שמירה
        </div>
        <button
          className="w-full py-2 rounded bg-[#f7fafd] hover:bg-[#eaf7ef] text-[#1976D2] font-medium mb-1 border"
          onClick={() => {
            onExportExcel();
            onClose();
          }}
        >
          ייצוא לאקסל (.xlsx)
        </button>
        <button
          className="w-full py-2 rounded bg-[#f7fafd] hover:bg-[#f3f0fa] text-[#4B5563] font-medium border"
          onClick={() => {
            onPrint();
            onClose();
          }}
        >
          שמור / הדפס כ־PDF
        </button>
        <button
          className="mt-3 w-full py-1 text-xs text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
