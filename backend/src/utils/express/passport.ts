import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JWTStrategy, VerifiedCallback } from 'passport-jwt';
import passportShraga from '@yesodot/passport-shraga';
import { Request } from 'express';
import { config } from '../../config/index';

const { callbackURL, shragaURL, secret, token } = config.authentication;
const ShragaStrategy = passportShraga.Strategy;
const serialize = (user: { id: string } | Express.User, done: (err?: Error, id?: string) => void): void => {
    done(undefined, jwt.sign({ ...user }, secret));
};
const deserialize = (tokenToDecode: string, done: (err?: Error, id?: any) => void): void => {
    done(undefined, jwt.decode(tokenToDecode));
};
export const initPassport = () => {
    passport.serializeUser(serialize);
    passport.deserializeUser(deserialize);
    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: (req: Request) => {
                    return req.cookies[token] || null;
                },
                secretOrKey: secret,
            },
            (payload: any, next: VerifiedCallback) => {
                if (payload) {
                    return next(null, payload);
                }
                return next(null, false);
            },
        ),
    );
    passport.use(
        new ShragaStrategy({ callbackURL, shragaURL }, async (user: any, done: any) => {
            done(null, user);
        }),
    );
};

export interface ShragaUser {
    id: string;
    adfsId: string;
    genesisId: string;
    name: { firstName: string; lastName: string };
    displayName: string;
    upn: string;
    provider: 'Genesis' | 'ADFS';
    personalNumber: string;
    entityType: string;
    job: string;
    phoneNumbers: string[];
    email: string;
    photo: any;
    identityCard: string;
    RelayState?: string;
    exp: number;
    iat: number;
    jti: string;
}

declare global {
    namespace Express {
        export interface User extends ShragaUser {}
    }
}
