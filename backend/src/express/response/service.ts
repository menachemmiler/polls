import axios from 'axios';
import { config } from '../../config';

const {
    response: { uri, baseRoute },
    service,
} = config;

export class ResponseService {
    private static api = axios.create({
        baseURL: `${uri}${baseRoute}`,
        timeout: service.requestTimeout,
    });

    static async createOne(body: any) {
        const { data } = await ResponseService.api.post('/', body);
        return data;
    }
    static async deleteAllByPollId(pollId: string) {
        const { data } = await ResponseService.api.delete(`/${pollId}`);
        return data;
    }
    static async hasUserResponded(pollId: string, genesisId: string) {
        const { data } = await ResponseService.api.get(`/${pollId}/${genesisId}`);
        return data;
    }
    static async deleteByQuestion(pollId: string, questionId: string) {
        const { data } = await ResponseService.api.delete(`/${pollId}/question/${questionId}`);
        return data;
    }
    static async getAnswersByQuestionId(questionId: string): Promise<any[]> {
        const { data } = await ResponseService.api.get(`/question/${questionId}`);
        return data;
    }
    static async hasResponses(pollId: string) {
        const { data } = await ResponseService.api.get(`/hasResponses/${pollId}`);
        return data.has;
    }
    static async getRespondentsByPollId(pollId: string) {
        const data = await ResponseService.api.get(`/respondents/${pollId}`);
        return data;
    }
    static async getByPollId(pollId: string) {
        const { data } = await ResponseService.api.get(`/${pollId}`);
        return data;
    }
}
