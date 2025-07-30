import 'dotenv/config';
import env from 'env-var';

export const config = {
    service: {
        port: env.get('PORT').default(8000).asPortNumber(),
    },
    mongo: {
        uri: env.get('MONGO_URI').default('mongodb://localhost/amanPolls').asString(),
        questionsCollectionName: env.get('QUESTIONS_COLLECTION_NAME').default('questions').asString(),
    },
};
