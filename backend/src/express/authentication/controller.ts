import { Request, Response } from 'express';
import { config } from '../../config';
import { ShragaUser } from '../../utils/express/passport';
import { AuthenticationManager } from './manager';
import { UsersController } from '../users/controller';
import { IUser, UsersRoles } from '../users/interface';

const {
    service: { systemUnavailableURL },
    authentication: { token },
} = config;
export class AuthenticationController {
    static async createTokenAndRedirect(req: Request, res: Response) {
        const { exp, iat, jti, RelayState, ...shragaUser } = req.user as ShragaUser;

        const user: IUser = {
            genesisId: shragaUser.genesisId,
            fullName: `${shragaUser.name.firstName} ${shragaUser.name.lastName}`,
            email: shragaUser.email,
            role: UsersRoles.USER,
        };

        await UsersController.createUserFromShraga(user);
        const result = await AuthenticationManager.getUserToken(shragaUser);
        if (!result) return res.redirect(`${systemUnavailableURL}`);
        res.cookie(token, result);
        return res.redirect(`${RelayState}` || '');
    }
}
