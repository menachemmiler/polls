import jwt from 'jsonwebtoken';
import { config } from '../../config';

export class AuthenticationManager {
    static async getUserToken(payload: object): Promise<string | null> {
        return jwt.sign({ ...payload }, config.authentication.secret, { expiresIn: config.authentication.expiresIn, algorithm: 'HS256' });
    }
}
