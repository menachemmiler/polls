import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { ServiceError } from '../../utils/errors';

export class AuthService {
    static verifyToken(token: string): { genesisId: string } {
        try {
            const decoded = jwt.verify(token, config.authentication.secret) as { genesisId: string };
            return decoded;
        } catch (error) {
            throw ServiceError.invalidToken();
        }
    }
}
