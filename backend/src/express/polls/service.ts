import axios from 'axios';
import { config } from '../../config';
import { PollDocument } from './interface';

const {
    polls: { uri, baseRoute },
    service,
} = config;

export class pollservice {
    private static api = axios.create({
        baseURL: `${uri}${baseRoute}`,
        timeout: service.requestTimeout,
        params: { expanded: true },
    });

    static async createOne(body: any) {
        const { data } = await pollservice.api.post('/', body);
        return data;
    }
    static async getById(id: string) {
        const { data } = await pollservice.api.get(`/${id}`);
        return data;
    }

    static async getManyById(ids: [string]) {
        const { data } = await pollservice.api.get(`/`, { params: { pollIds: ids } });
        return data;
    }

    static async attachQuestion(pollId: string, questionId: string, sectionId?: string, index?: number) {
        const { data } = await pollservice.api.put(`/question`, { questionId, pollId, sectionId, index });

        return data;
    }

    static async detachQuestion(pollId: string, sectionId: string, questionId: string) {
        const { data } = await pollservice.api.delete(`/question`, { data: { questionId, pollId, sectionId } });
        return data;
    }
    static async deleteOne(id: string) {
        const { data } = await pollservice.api.delete(`/${id}`);
        return data;
    }
    static async addSection(pollId: string) {
        const { data } = await pollservice.api.post(`/addsection/${pollId}`);
        return data;
    }
    static async updateOne(pollId: string, update: Partial<PollDocument>) {
        const { data } = await pollservice.api.put(`/${pollId}`, update);
        return data;
    }
    static async deleteSection(pollId: string, sectionId: string) {
        const { data } = await pollservice.api.delete(`/section/${pollId}/${sectionId}`);
        return data;
    }
}
