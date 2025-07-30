import axios from 'axios';
import { config } from '../../config';

const {
    statistics: { uri, baseRoute },
    service,
} = config;

export class StatisticsService {
    private static api = axios.create({
        baseURL: `${uri}${baseRoute}`,
        timeout: service.requestTimeout,
    });
    static async getByPollId(pollId: string) {
        const { data } = await StatisticsService.api.get(`/${pollId}`);
        return data;
    }
    static async createOne(data: { pollId: string; questionStats: any[] }) {
        const { data: responseData } = await StatisticsService.api.post('/', data);
        return responseData;
    }

    static async updateOne(pollId: string, answers: any) {
        return this.api.put(`/${pollId}/statistics`, { answers });
    }

    static async deleteOne(pollId: string) {
        return this.api.delete(`/${pollId}`);
    }
    static async deleteQuestion(pollId: string, questionId: string) {
        const { data } = await StatisticsService.api.delete(`/${pollId}/questions/${questionId}`);
        return data;
    }
    static async updateForm(pollId: string, question: any) {
        const { data } = await StatisticsService.api.patch(`/${pollId}/form`, question);
        return data;
    }
}
