import env from 'env-var';
import './dotenv';

export const config = {
    service: {
        port: env.get('PORT').default(5000).asPortNumber(),
        systemUnavailableURL: env.get('SYSTEM_UNAVAILABLE_URL').default('/unavailable').required().asString(),
        requestTimeout: env.get('REQUEST_TIMEOUT').default(10000).asIntPositive(),
    },
    users: {
        uri: env.get('USERS_SERVICE_URI').default('http://users:8000').asString(),
        baseRoute: env.get('USERS_BASE_ROUTE').default('/api/users').asString(),
    },
    statistics: {
        uri: env.get('STATISTICS_SERVICE_URI').default('http://statistics:8000').asString(),
        baseRoute: env.get('STATISTICS_BASE_ROUTE').default('/api/statistics').asString(),
    },
    authentication: {
        secret: env.get('SECRET_KEY').default('secret').asString(),
        token: env.get('ACCESS_TOKEN_NAME').default('amanPolls-token').asString(),
        baseRoute: env.get('AUTHENTICATION_BASE_ROUTE').default('/api/auth').asString(),
        callbackURL: env.get('CALLBACK_URL').required().asString(),
        shragaURL: env.get('SHRAGA_URL').required().asString(),
        isRequired: env.get('IS_AUTHENTICATION_REQUIRED').default('false').asBool(),
        useEnrichId: env.get('USE_ENRICH_ID').default('true').asBool(),
        sessionSecret: env.get('SESSION_SECRET').default('secret').asString(),
        expiresIn: env.get('ACCESS_TOKEN_EXPIRATION_TIME').default('1d').asString(),
    },
    kartoffel: {
        baseUrl: env.get('KARTOFFEL_BASE_URL').default('https://kartoffel.branch-yesodot.org').asString(),
        baseEntitiesRoute: env.get('KARTOFFEL_BASE_ENTITIES_ROUTE').default('/api/entities').asString(),
        baseGroupsRoute: env.get('KARTOFFEL_BASE_GROUPS_ROUTE').default('/api/groups').asString(),
        baseRoute: env.get('KARTOFFEL_BASE_ROUTE').default('/api/kartoffel').asString(),
    },
    response: {
        uri: env.get('RESPONSE_SERVICE_URI').default('http://response:8000').asString(),
        baseRoute: env.get('RESPONSE_BASE_ROUTE').default('/api/response').asString(),
    },
    questions: {
        uri: env.get('QUESTIONS_SERVICE_URI').default('http://questions:8000').asString(),
        baseRoute: env.get('QUESTIONS_BASE_ROUTE').default('/api/questions').asString(),
    },
    polls: {
        uri: env.get('POLL_SERVICE_URI').default('http://polls:8000').asString(),
        baseRoute: env.get('POLL_BASE_ROUTE').default('/api/polls').asString(),
    },
    dispatch: {
        uri: env.get('DISPATCH_SERVICE_URI').default('http://dispatch:8000').asString(),
        baseRoute: env.get('DISPATCH_BASE_ROUTE').default('/api/dispatch').asString(),
    },
    permissions: {
        uri: env.get('PERMISSIONS_SERVICE_URI').default('http://permissions:8000').asString(),
        baseRoute: env.get('PERMISSIONS_BASE_ROUTE').default('/api/permissions').asString(),
    },
};
