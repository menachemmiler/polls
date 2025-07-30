import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
      <div className="text-center px-6 py-12 bg-white shadow-xl rounded-lg max-w-md">
        <h1 className="text-7xl font-extrabold text-red-600 mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("pages.NotFound.PAGE_NOT_FOUND")}
        </h2>
        <p className="text-gray-600 mb-6">{t("pages.NotFound.OOPS")}</p>
        <Link
          to="/"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          {t("pages.NotFound.BACK_HOME")}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
