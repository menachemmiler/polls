import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import forms_blank from "../../assets/forms_blank.png";
import { useNavigate } from "react-router-dom";
import { pollService } from "../../services/pollService";
import { toastService } from "../../services/toastService";

const NewFormButton: React.FC = () => {
  const navigate = useNavigate();
  const { mutate } = pollService.useCreatePoll();

  const { t } = useTranslation();

  const handleCreatePoll = () => {
    mutate(
      {
        name: t("NewForm.newPollDefaultName"),
        title: t("NewForm.newPollDefaultTitle"),
      },
      {
        onSuccess: (data) => {
          navigate(`/poll/${data._id}`);
        },
        onError: () => {
          toastService.error("Failed to create new poll");
        },
      }
    );
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4"> {t("NewForm.startNewForm")}</h2>
      <div className="flex flex-row-reverse justify-end gap-4">
        <div onClick={handleCreatePoll} className={`${cardClasses} w-50`}>
          <img
            src={forms_blank}
            alt="Create New Form"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default NewFormButton;

const cardClasses = clsx(
  "w-40 h-40 cursor-pointer",
  "flex items-center justify-center",
  "hover:bg-gray-100 hover:border-purple-800",
  "rounded-lg overflow-hidden border border-gray-200"
);
