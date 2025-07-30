import React, { useEffect, useState } from "react";
import clsx from "clsx";
import FilterBar, { SortOption } from "../features/home/FilterBar";
import Navbar from "../components/layout/HomeNavbar";
import FormDisplay from "../features/home/FormDisplay";
import { IPoll } from "../types/survey";
import { pollService } from "../services/pollService";
import NewFormButton from "../features/home/NewFormButton";
import Loading from "../components/shared/Loading";

export type OwnershipFilter = "all" | "owner" | "notOwner";

const Home: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [ownershipFilter, setOwnershipFilter] =
    useState<OwnershipFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("updatedRecently");
  const [filteredForms, setFilteredForms] = useState<IPoll[]>([]);

  const forms = pollService.useGetMyPolls();

  useEffect(() => {
    Object.keys(localStorage)
      .filter(
        (key) =>
          key.startsWith("responses-activeTab-") ||
          key.startsWith("question-selected-idx-") ||
          key.startsWith("responder-selected-idx-") ||
          key.startsWith("responders-list-")
      )
      .forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    if (forms.refetch) {
      forms.refetch();
    }
  }, []);

  useEffect(() => {
    if (!forms.data) return;

    const { owner, editor } = forms.data;

    const baseForms = (() => {
      switch (ownershipFilter) {
        case "all":
          return [...owner, ...editor];
        case "owner":
          return owner;
        case "notOwner":
          return editor;
        default:
          return [];
      }
    })();

    const sortedForms = (() => {
      switch (sortOption) {
        case "updatedRecently":
          return [...baseForms].sort(
            (a, b) =>
              new Date(b.updatedAt ?? 0).getTime() -
              new Date(a.updatedAt ?? 0).getTime()
          );
        case "recentFirst":
          return [...baseForms].sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          );
        case "oldestFirst":
          return [...baseForms].sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );
        case "nameAsc":
          return [...baseForms].sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? "")
          );
        case "nameDesc":
          return [...baseForms].sort((a, b) =>
            (b.name ?? "").localeCompare(a.name ?? "")
          );
        default:
          return baseForms;
      }
    })();

    setFilteredForms(sortedForms);
  }, [forms.data, ownershipFilter, sortOption]);

  return (
    <div className={homePageClasses} dir="rtl">
      <Navbar
        polls={[...(forms.data?.editor || []), ...(forms.data?.owner || [])]}
      />
      <main className="p-6 max-w-7xl mx-auto">
        <section className="mt-12 space-y-8">
          <div className="flex items-center justify-between">
            <NewFormButton />
          </div>

          <FilterBar
            viewMode={viewMode}
            onViewChange={setViewMode}
            ownershipFilter={ownershipFilter}
            onOwnershipChange={setOwnershipFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
          {forms.isPending && (
            <div className="flex justify-center mt-10">
              <Loading />
            </div>
          )}

          {forms.isError && (
            <div className="mt-10 p-6 text-center text-red-600 bg-red-100 border border-red-300 rounded">
              <p className="text-base font-semibold">
                לא הצלחנו לטעון את הטפסים שלך
              </p>
              <p className="text-sm mt-2 text-gray-700">
                ודא שיש לך חיבור לאינטרנט ונסה שוב
              </p>
              <button
                onClick={() => forms.refetch?.()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                נסה שוב
              </button>
            </div>
          )}

          {forms.isSuccess && filteredForms.length === 0 && (
            <>
              <div className="shadow-md p-6 text-center text-gray-600 mt-10">
                <p className="text-base mb-1 font-medium">
                  עדיין לא נוצרו טפסים
                </p>
                <p className="text-sm text-gray-500">
                  כדי להתחיל, בחר טופס ריק או השתמש בתבנית למעלה
                </p>
              </div>
            </>
          )}

          {forms.isSuccess && filteredForms.length > 0 && (
            <div
              className={clsx(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center"
                  : "flex flex-col gap-4"
              )}
            >
              {filteredForms.map((form) => (
                <FormDisplay key={form._id} poll={form} viewMode={viewMode} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;

const homePageClasses = clsx(
  "w-full",
  "min-h-screen",
  "bg-white",
  "text-right",
  "font-sans"
);
