import axios from 'axios';
import { config } from '../../config';
import { KartoffelService } from '../kartoffel/service';
import { PermissionType } from './interface';

const {
    permissions: { uri, baseRoute },
    service,
} = config;

export class PermissionsService {
    private static api = axios.create({
        baseURL: `${uri}${baseRoute}`,
        timeout: service.requestTimeout,
    });

    static async createOne(pollId: string, userId: string) {
        const { data } = await this.api.post(`/${pollId}/${userId}`);
        return data;
    }

    static async getAllPolls(userId: string, query: any) {
        const { data } = await this.api.get(`/polls/${userId}`, { params: query });
        return data;
    }

    static async getPollPermissions(pollId: string) {
        const { data } = await this.api.get(`/${pollId}`);

        if (data.accessUsers?.length) {
            data.accessUsers = await Promise.all(
                data.accessUsers.map(async (user: { userId: string; permission: PermissionType }) => {
                    const userData = await KartoffelService.getUserById(user.userId);
                    return {
                        user: userData,
                        permission: user.permission,
                    };
                }),
            );
        }

        if (data.owner) {
            data.owner = await KartoffelService.getUserById(data.owner);
        }

        if (data.newOwner) {
            data.newOwner = await KartoffelService.getUserById(data.newOwner);
        }

        return data;
    }

    static async getPollUserPermission(pollId: string, userId: string, level: PermissionType) {
        const { data } = await this.api.get(`/${pollId}/${userId}`, {
            params: { level },
        });
        return data;
    }

    static async getPublishRequest(pollId: string) {
        const { data } = await this.api.get(`/publish/${pollId}`);
        return data;
    }

    static async updatePermission(pollId: string, body: any) {
        const { data } = await this.api.put(`/${pollId}`, body);
        return data;
    }

    static async rejectOwner(pollId: string, body: any) {
        const { data } = await this.api.put(`/owner/${pollId}`, body);
        return data;
    }

    static async accepteOwner(pollId: string, body: any) {
        const { data } = await this.api.put(`/owner/accepte/${pollId}`, body);
        return data;
    }

    static async updateNewOwner(pollId: string, userId: string, body: any) {
        const { data } = await this.api.put(`/owner/${pollId}/${userId}`, body);
        return data;
    }

    static async updatePublish(pollId: string) {
        const { data } = await this.api.put(`/publish/${pollId}`);
        return data;
    }

    static async updateManyUsers(pollId: string, userIds: string[], level: string, action: boolean) {
        const { data } = await this.api.put(`/${pollId}/users`, {
            users: userIds,
            level,
            action,
        });

        return data;
    }

    static async deleteOne(pollId: string) {
        const { data } = await this.api.delete(`/${pollId}`);
        return data;
    }
    static async updateRespondable(pollId: string, respondable: boolean) {
        const { data } = await this.api.put(`/respondable/${pollId}`, { respondable });
        return data;
    }
    static async updateHierarchy(pollId: string, groupHierarchy: string, groupId: string, action: boolean) {
        const { data } = await this.api.put(`/updateHierarchy/${pollId}`, {
            groupId,
            groupHierarchy,
            action,
        });
        return data;
    }

    static async updateOneUser(pollId: string, userId: string, level: PermissionType) {
        const { data } = await this.api.put(`/${pollId}/${userId}`, {}, { params: { level } });

        return data;
    }
    static async updateAccessLevel(pollId: string, permission: boolean) {
        const { data } = await this.api.put(`/${pollId}`, { permission });
        return data;
    }
}
