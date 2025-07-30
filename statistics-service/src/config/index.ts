import * as env from 'env-var';
import './dotenv';

const isTest = process.env.NODE_ENV === 'test';

export const config = {
    service: {
        port: env.get('PORT').default(8000).asPortNumber(),
        defaultLimit: env.get('DEFAULT_LIMIT').asIntPositive(),
    },
    mongo: {
        uri: env
            .get('MONGO_URI')
            .default(isTest
                ? 'mongodb://localhost:27017/statistics_test'
                : 'mongodb://localhost:27017/statistics'
            )
            .asString(),

        statisticsCollectionName: env
            .get('STATISTICS_COLLECTION_NAME')
            .default(isTest ? 'statistics_test' : 'statistics')
            .asString(),
    },
};
