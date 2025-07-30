import axios from 'axios';
import https from 'https';
import { config } from '../../config';
import { BaseKartoffelUser } from './interface';
import { logger } from '../../utils/logger';

const {
    kartoffel: { baseUrl, baseEntitiesRoute, baseGroupsRoute },
} = config;

export class KartoffelService {
    public static api = axios.create({
        baseURL: `${baseUrl}`,
        timeout: config.service.requestTimeout,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    static async getUsersByIds(ids: string[], pageSize: number = 100, page: number = 1) {
        try {
            const { data } = await KartoffelService.api.get(`${baseEntitiesRoute}`, {
                params: {
                    ids: ids.join(','),
                    page,
                    pageSize,
                },
            });
            return data;
        } catch (err: any) {
            logger.error('Error in KartoffelService.getUsersByIds:', err?.response?.data || err?.message || err);
            throw err;
        }
    }

    static async getUserById(id: string) {
        const { data } = await KartoffelService.api.get<BaseKartoffelUser>(`${baseEntitiesRoute}/${id}`);
        return data;
    }

    static async searchUsersByName(fullName: string) {
        const { data } = await KartoffelService.api.get<BaseKartoffelUser[]>(`${baseEntitiesRoute}/search`, { params: { fullName } });
        return data;
    }
    static async searchGroupsByName(nameAndHierarchy: string) {
        const { data } = await KartoffelService.api.get<BaseKartoffelUser[]>(`${baseGroupsRoute}/search`, {
            params: { nameAndHierarchy },
        });
        return data;
    }
    static async getGroupById(GroupId: string, numPages, pageSize) {
        const { data } = await KartoffelService.api.get<BaseKartoffelUser>(`${baseEntitiesRoute}/group/${GroupId}`, {
            params: { direct: false, expanded: false, page: numPages, pageSize },
        });
        return data;
    }
}
