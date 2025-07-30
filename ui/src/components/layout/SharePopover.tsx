import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Settings,
  HelpCircle,
  Lock,
  Globe2,
  ChevronDown,
  Check,
} from "lucide-react";
import HierarchySearchSection from "../../features/kartoffelSearch/HierarchySearchSection";
import UserSearchSection from "../../features/kartoffelSearch/UserSearchSection";
import { useUserStore } from "../../stores/user";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import { useSharePopover } from "../../hooks/useSharePopover";

interface Props {
  pollId: string;
  onClose?: () => void;
}

const SharePopover: React.FC<Props> = ({ pollId, onClose }) => {
  const { t } = useTranslation();
  const {
    searchMode,
    setSearchMode,
    selectedGroup,
    setSelectedGroup,
    selectedUsers,
    setSelectedUsers,
    accessLevel,
    setAccessLevel,
    showDropdown,
    setShowDropdown,
    showAccessUsers,
    setShowAccessUsers,
    owner,
    accessUsers,
    accessHierarchyList,
    updateUsersAccess,
    updateHierarchyAccess,
    handleFinish,
    updateUserPermission,
  } = useSharePopover(pollId);
  const shragaUser = useUserStore((state) => state.user);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
      dir="rtl"
    >
      <div className="w-[35rem] bg-white rounded-lg shadow-2xl text-sm text-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-medium">שיתוף של "טופס ללא כותרת"</h2>
          </div>
          <HelpCircle className="w-5 h-5 text-gray-400" />
        </div>

        <div className="px-6 py-4">
          {/* Selector */}
          <div className="mb-4">
            <select
              value={searchMode ?? ""}
              onChange={(e) => {
                setSearchMode(e.target.value as "hierarchy" | "user");
                setSelectedGroup(null);
                setSelectedUsers([]);
              }}
              className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                בחר שיטת חיפוש
              </option>
              <option value="hierarchy">לפי היררכיה</option>
              <option value="user">לפי משתמשים</option>
            </select>
          </div>

          {/* Dynamic Section */}
          {searchMode === "hierarchy" && (
            <HierarchySearchSection
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
            />
          )}
          {searchMode === "user" && (
            <UserSearchSection
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          )}

          {/* User info */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              היררכיות עם גישה
            </h2>
            {accessHierarchyList.length > 0 ? (
              <div className="space-y-2 mt-4 mb-6">
                {accessHierarchyList.map(({ groupId, groupHierarchy }) => (
                  <div
                    key={groupId}
                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-800 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 11a4 4 0 10-8 0 4 4 0 008 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {groupHierarchy}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        updateHierarchyAccess(groupId, groupHierarchy, false)
                      }
                      className="text-sm text-red-600 hover:underline"
                    >
                      הסר גישה
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">
                לא נוספו היררכיות עם הרשאה
              </p>
            )}

            <h2 className="text-lg font-medium text-gray-900">אנשים עם גישה</h2>

            <div className="mb-4">
              <div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 mb-2"
                onClick={() => setShowAccessUsers(!showAccessUsers)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {accessUsers.length} משתמשים עם הרשאה
                  </div>
                  <div className="text-xs text-gray-600">
                    לחץ להצגת או הסתרת המשתמשים
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showAccessUsers ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showAccessUsers && (
                <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50">
                  {owner && (
                    <div className="flex items-center justify-between p-3 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                          {`${owner.firstName[0]}${owner.lastName[0]}`.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {owner.fullName} (בעלים)
                          </div>
                          <div className="text-xs text-gray-600">
                            {owner.mail}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {[...accessUsers]
                    .sort((a) => (a.permission === "editor" ? -1 : 1))
                    .map(({ user: accessUser, permission }, index) => {
                      const avatarColors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                        "bg-yellow-500",
                        "bg-pink-500",
                      ];
                      const bgColor = avatarColors[index % avatarColors.length];
                      return (
                        <div
                          key={accessUser.id}
                          className="flex items-center justify-between p-3 bg-white transition"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${bgColor}`}
                            >
                              {`${accessUser.firstName[0]}${accessUser.lastName[0]}`.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {accessUser.fullName + " "}
                                {shragaUser.genesisId === accessUser.id && (
                                  <span className="">(אני)</span>
                                )}
                              </div>

                              <div className="text-xs text-gray-600">
                                {accessUser.hierarchy}
                              </div>
                            </div>
                          </div>
                          {/*  */}
                          {shragaUser.genesisId === accessUser.id ? (
                            <div className="text-base text-gray-800 bg-white focus:outline-none cursor-pointer px-4 py-2 rounded w-44">
                              {permission === "editor" ? "עריכה" : "משיב/ה"}
                            </div>
                          ) : (
                            <select
                              className="text-base text-gray-800 bg-white focus:outline-none cursor-pointer px-4 py-2 rounded w-44"
                              onChange={(e) => {
                                const action = e.target.value;
                                if (action === "remove") {
                                  updateUsersAccess([accessUser], false);
                                } else if (
                                  action === "viewer" ||
                                  action === "editor"
                                ) {
                                  updateUserPermission(accessUser.id, action);
                                }
                              }}
                              defaultValue={permission}
                            >
                              <option value="viewer">משיב/ה</option>
                              <option value="editor">עריכה</option>
                              <option value="transfer">העברת בעלות</option>
                              <option value="remove" className="text-red-600">
                                הסרת גישה
                              </option>
                            </select>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Access level */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-4">גישה כללית</p>
            <div className="relative">
              <div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {accessLevel === "limited" ? (
                    <Lock className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Globe2 className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {accessLevel === "limited"
                      ? "גישה מוגבלת"
                      : "כל מי שקיבל או קיבלה את הקישור הזה"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {accessLevel === "limited"
                      ? "רק אנשים שיש להם גישה לקישור יכולים לפתוח אותו"
                      : "כל המשתמשים באינטרנט שיש להם את הקישור יכולים להשיב"}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {["limited", "anyone"].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setAccessLevel(option as "limited" | "anyone");
                          setShowDropdown(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <span className="text-sm">
                          {option === "limited"
                            ? "גישה מוגבלת"
                            : "כל מי שקיבל או קיבלה את הקישור הזה"}
                        </span>
                        {accessLevel === option && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-4 py-2 text-sm font-semibold text-purple-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={() => setShowSaveConfirm(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={() => {
          setShowSaveConfirm(false);
          handleFinish(onClose);
        }}
        title="אישור שמירה"
        message="הולכים להתבצע שינויים בהרשאות השיתוף. האם לאשר?"
        confirmText="אישור שינויים"
        cancelText="חזור"
      />
      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          onClose?.();
        }}
        title="בטוח שברצונך לצאת?"
        message="השינויים שביצעת לא יישמרו. האם להמשיך?"
        confirmText="צא ללא שמירה"
        cancelText="חזור"
      />
    </div>
  );
};

export default SharePopover;
