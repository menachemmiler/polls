import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(2000).asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost/amanPolls').asString(),
        usersCollectionName: env.get('USERS_COLLECTION_NAME').default('surveys-users').asString(),
    },
};
