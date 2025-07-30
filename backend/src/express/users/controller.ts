import { IUser } from './interface';
import { UsersService } from './service';

export class UsersController {
    static async createUserFromShraga(user: IUser) {
        const exists = await UsersService.getByGenesisId(user.genesisId);
        if (exists) return;
        await UsersService.createFromShraga(user);
    }
}
