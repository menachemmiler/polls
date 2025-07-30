import { useEffect, useState } from "react";
import { GroupEntity, UserProfile } from "../types/kartoffelType";
import { kartoffelService } from "../services/kartoffelService";

interface Hierarchy {
  groupId: string;
  groupHierarchy: string;
}

type PermissionType = "viewer" | "editor";

interface AccessUser {
  user: UserProfile;
  permission: PermissionType;
}

export const useSharePopover = (pollId: string) => {
  const [searchMode, setSearchMode] = useState<"hierarchy" | "user" | null>(
    null
  );
  const [selectedGroup, setSelectedGroup] = useState<GroupEntity | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);
  const [accessLevel, setAccessLevel] = useState<"limited" | "anyone">(
    "anyone"
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccessUsers, setShowAccessUsers] = useState(false);

  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>([]);
  const [accessHierarchyList, setAccessHierarchyList] = useState<Hierarchy[]>(
    []
  );

  useEffect(() => {
    const fetchPermissions = async () => {
      const data = await kartoffelService.getPollPermission(pollId);
      setAccessLevel(data.access ? "anyone" : "limited");
      setOwner(data.owner);
      setAccessHierarchyList(data.accessHierarchy);
      setAccessUsers(data.accessUsers);
    };
    fetchPermissions();
  }, [pollId]);

  const updateUsersAccess = async (
    users: UserProfile[],
    action: boolean,
    permission: PermissionType = "viewer"
  ) => {
    const userIds = users.map((user) => user.id);
    await kartoffelService.updateAccessUsers(pollId, userIds, action);
    if (!action) {
      setAccessUsers((prev) =>
        prev.filter((au) => !userIds.includes(au.user.id))
      );
    } else {
      const newAccess = users.map((user) => ({
        user,
        permission,
      }));
      setAccessUsers((prev) => [...prev, ...newAccess]);
    }
  };

  const updateHierarchyAccess = async (
    groupId: string,
    groupHierarchy: string,
    action: boolean
  ) => {
    await kartoffelService.updateAccessHierarchy(
      pollId,
      groupId,
      groupHierarchy.toString(),
      action
    );
    if (action) {
      setAccessHierarchyList((prev) => [...prev, { groupId, groupHierarchy }]);
    } else {
      setAccessHierarchyList((prev) =>
        prev.filter((h) => h.groupId !== groupId)
      );
    }
  };
  const updateUserPermission = async (
    userId: string,
    newPermission: "viewer" | "editor"
  ) => {
    await kartoffelService.updateUserPermission(pollId, userId, newPermission);
    setAccessUsers((prev) =>
      prev.map((au) =>
        au.user.id === userId ? { ...au, permission: newPermission } : au
      )
    );
  };

  const handleFinish = async (onClose?: () => void) => {
    if (searchMode === "hierarchy" && selectedGroup) {
      await updateHierarchyAccess(
        selectedGroup.id,
        selectedGroup.hierarchy,
        true
      );
    } else if (searchMode === "user" && selectedUsers.length > 0) {
      await updateUsersAccess(selectedUsers, true, "viewer");
    }
    await kartoffelService.updateAccessLevel(pollId, accessLevel);
    onClose?.();
  };

  return {
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
  };
};
