import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').required().asString(),
        pollsCollectionName: env.get('POLLS_COLLECTION_NAME').required().asString(),
    },
};
