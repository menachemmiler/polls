import axios from 'axios';
import { config } from '../../config';
import { IUser } from './interface';

const {
    users: { uri, baseRoute },
    service,
} = config;

export class UsersService {
    private static api = axios.create({
        baseURL: `${uri}${baseRoute}`,
        timeout: service.requestTimeout,
        params: { expanded: true },
    });

    static async createFromShraga(user: IUser): Promise<void> {
        await UsersService.api.post('/', user);
    }

    static async getById(id: string): Promise<IUser | null> {
        const { data } = await UsersService.api.get<IUser>(`/${id}`);
        return data;
    }
    static async getByGenesisId(id: string): Promise<IUser | null> {
        const { data } = await UsersService.api.get<IUser>(`/by-genesis/${id}`);
        return data;
    }
}
