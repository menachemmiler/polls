import axios from 'axios';
import { config } from '../../config';
import { Question } from './interface';

const {
    questions: { uri, baseRoute },
    service,
} = config;

export class QuestionsService {
    private static api = axios.create({
        baseURL: `${uri}${baseRoute}`,
        timeout: service.requestTimeout,
    });

    static async createOne(body: any) {
        const { data } = await QuestionsService.api.post('/', body);
        return data;
    }
    static async getById(id: string) {
        const { data } = await QuestionsService.api.get(`/byIds/?questionsIds=${id}`);
        return data;
    }
    static async deleteOne(id: string) {
        const { data } = await QuestionsService.api.delete(`/${id}`);
        return data;
    }
    static async getByIds(ids: string[]) {
        const { data } = await QuestionsService.api.get('/byIds', {
            params: { questionsIds: ids.join(',') },
        });
        return data;
    }

    static async deleteManyByIds(questionIds: string[]) {
        return this.api.delete('/many', {
            params: {
                questionsIds: questionIds.join(','),
            },
        });
    }
    static async updateOne(questionId: string, update: Partial<Question>) {
        const { data } = await this.api.put(`/${questionId}`, update);
        return data;
    }
}
