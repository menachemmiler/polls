import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Trash2, ExternalLink, Type, Users2 } from "lucide-react";
import { IPoll } from "../../types/survey";
import formsIcon from "../../assets/forms_logo.svg";
import preview from "../../assets/form_preview.png";
import { formatDate } from "../../utils/formatDate";
import { useClickOutside } from "../../hooks/useClickOutside";
import { pollService } from "../../services/pollService";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import RenameDialog from "../../components/shared/RenameDialog";
import { useTranslation } from "react-i18next";

interface FormCardProps {
  poll: IPoll;
  viewMode: "grid" | "list";
  isSelectorMode?: boolean;
  onClosePromptSelector?: () => void;
  setPollToImport?: (poll: IPoll | null) => void;
}

const FormDisplay: React.FC<FormCardProps> = ({
  poll,
  viewMode,
  isSelectorMode,
  onClosePromptSelector: onClose,
  setPollToImport,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: deletePoll } = pollService.useDeletePoll(
    (data) => console.log(t("formDisplay.deleteSuccess"), data),
    (error) => console.error(t("formDisplay.deleteError"), error)
  );

  const { mutate: updatePoll } = pollService.useUpdatePoll();

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const menuOptions = [
    {
      label: t("formDisplay.rename"),
      value: "rename",
      icon: <Type size={16} />,
    },
    {
      label: t("formDisplay.delete"),
      value: "delete",
      icon: <Trash2 size={16} />,
    },
    {
      label: t("formDisplay.openInNewTab"),
      value: "openNewTab",
      icon: <ExternalLink size={16} />,
    },
  ];

  const handleOptionClick = (action: string) => {
    setMenuOpen(false);
    switch (action) {
      case "rename":
        setShowRenameDialog(true);
        break;
      case "delete":
        setShowDeleteDialog(true);
        break;
      case "openNewTab":
        window.open(`/poll/${poll._id}`, "_blank");
        break;
      default:
        break;
    }
  };

  const renderMenu = () => (
    <div
      ref={menuRef}
      className="absolute z-50 mt-1 w-52 right-0 bg-white border border-gray-300 rounded shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      {menuOptions.map((option) => (
        <div
          key={option.value}
          className="hover:bg-gray-100 px-4 py-2 flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => handleOptionClick(option.value)}
        >
          {option.icon}
          {option.label}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        onClick={() => {
          if (!isSelectorMode) {
            navigate(`/poll/${poll._id}`);
          } else {
            onClose?.();
            setPollToImport?.(poll);
          }
        }}
        // dir="rtl"
        className={
          viewMode === "list"
            ? "px-8 py-4 rounded-md hover:bg-purple-100 cursor-pointer transition relative"
            : "w-[224px] border border-gray-300 rounded-lg hover:border-purple-400 cursor-pointer transition overflow-visible relative"
        }
      >
        {viewMode === "list" ? (
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center gap-2 truncate">
              <img
                src={formsIcon}
                alt={t("formDisplay.formIcon")}
                className="w-5 h-5"
              />
              <span className="font-medium text-gray-800 truncate">
                {poll.name}
              </span>
              <span title={t("formDisplay.pollPublished")}>
                <Users2 size={18} className="text-gray-600" />
              </span>
            </div>
            <div
              className="flex items-center gap-2 text-xs text-gray-600 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {!isSelectorMode && (
                <>
                  <span className="ml-2">
                    {t("formDisplay.updatedAt", {
                      date: formatDate(poll.updatedAt || new Date()),
                    })}
                  </span>
                  <MoreVertical
                    size={16}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={t("formDisplay.menu")}
                  />
                </>
              )}
              {menuOpen && renderMenu()}
            </div>
          </div>
        ) : (
          <>
            <div className="h-36 overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={preview}
                alt={t("formDisplay.previewAlt", { name: poll.name })}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-[1px] bg-gray-200" />
            <div className="px-4 pt-3 pb-4 space-y-1 relative">
              <div className="flex items-center gap-2">
                {isSelectorMode && (
                  <img
                    src={formsIcon}
                    alt={t("formDisplay.formIcon")}
                    className="w-4 h-4"
                  />
                )}
                <span className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                  {poll.name}
                </span>
              </div>
              <div
                className="flex items-center justify-between text-xs text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                {!isSelectorMode && (
                  <>
                    <img
                      src={formsIcon}
                      alt={t("formDisplay.formIcon")}
                      className="w-4 h-4"
                    />
                    <span title={t("formDisplay.pollPublished")}>
                      <Users2 size={18} className="text-gray-600" />
                    </span>
                    <span className="ml-2">
                      {t("formDisplay.updatedAt", {
                        date: formatDate(poll.updatedAt || new Date()),
                      })}
                    </span>
                    <div className="relative">
                      <MoreVertical
                        size={16}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label={t("formDisplay.menu")}
                      />
                      {menuOpen && renderMenu()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {showDeleteDialog && (
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            deletePoll({ pollId: poll._id });
            setShowDeleteDialog(false);
          }}
          confirmText={t("formDisplay.deleteConfirmButton")}
          title={t("formDisplay.deleteConfirmTitle")}
          message={t("formDisplay.deleteConfirmMessage", { name: poll.name })}
        />
      )}

      {showRenameDialog && (
        <RenameDialog
          isOpen={showRenameDialog}
          currentName={poll.name || ""}
          onConfirm={(newName) => {
            updatePoll({ pollId: poll._id, data: { name: newName } });
            setShowRenameDialog(false);
          }}
          onCancel={() => setShowRenameDialog(false)}
        />
      )}
    </>
  );
};

export default FormDisplay;
