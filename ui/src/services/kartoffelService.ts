import { GroupEntity, UserProfile } from "../types/kartoffelType";
import { environment } from "../globals";
import { axiosInstance } from "../axios";

class KartoffelService {
  private baseUrl = `${environment.env.backend_url}/api${environment.api.kartoffel}`;

  async searchUsers(name: string): Promise<UserProfile[]> {
    if (name.length < 2) return [];
    const { data } = await axiosInstance.get<UserProfile[]>(
      `${this.baseUrl}/searchUser/${name}`
    );

    return data;
  }

  async searchGroups(name: string): Promise<GroupEntity[]> {
    if (name.length < 2) return [];
    const { data } = await axiosInstance.get<GroupEntity[]>(
      `${this.baseUrl}/searchGroups/${name}`
    );
    return data;
  }

  async getGroupById(
    groupId: string,
    numPage: number = 1,
    pageSize: number = 250
  ): Promise<UserProfile[]> {
    const { data } = await axiosInstance.get<UserProfile[]>(
      `${this.baseUrl}/getGroupById/${groupId}`,
      {
        params: { numPage, pageSize },
      }
    );
    return data;
  }

  async updateAccessHierarchy(
    pollId: string,
    groupId: string,
    groupHierarchy: string,
    action: boolean
  ) {
    const { data } = await axiosInstance.put(
      `${environment.env.backend_url}/api/permissions/updateAccessHierarchy`,
      { pollId, groupHierarchy, groupId, action }
    );

    return data;
  }
  async updateAccessUsers(pollId: string, userIds: string[], action: boolean) {
    const { data } = await axiosInstance.put(
      `${environment.env.backend_url}/api/permissions/updateAccessUsers`,
      { pollId, users: userIds, action }
    );
    return data;
  }
  async getPollPermission(pollId: string) {
    const { data } = await axiosInstance.get(
      `${environment.env.backend_url}/api/permissions/${pollId}`
    );

    return data;
  }
  async updateUserPermission(
    pollId: string,
    userId: string,
    permission: "viewer" | "editor"
  ) {
    const { data } = await axiosInstance.put(
      `${environment.env.backend_url}/api/permissions/${pollId}/${userId}`,
      {},
      { params: { level: permission } }
    );
    return data;
  }
  async getPollAAA(pollId: string) {
    const { data } = await axiosInstance.get(
      `${environment.env.backend_url}/api/response/${pollId}`
    );

    return data;
  }
  async updateAccessLevel(pollId: string, accesspermission: "limited" | "anyone") {
   const permission = accesspermission === "limited" ? false : true; 
    const { data } = await axiosInstance.put(
      `${environment.env.backend_url}/api/permissions/${pollId}`,
      { permission }
    );

    return data;
  }
}

export const kartoffelService = new KartoffelService();
