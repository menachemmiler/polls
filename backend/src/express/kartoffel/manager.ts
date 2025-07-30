import { KartoffelService } from './service';

export class KartoffelManager {
    static async searchUsers(search: string) {
        return KartoffelService.searchUsersByName(search);
    }
    static async searchGroups(search: string) {
        return KartoffelService.searchGroupsByName(search);
    }
    static async getGroupById(groupId: string, numPage, pageSize) {
        return KartoffelService.getGroupById(groupId, numPage, pageSize);
    }
}
