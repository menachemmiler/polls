import { ServiceError } from '../../utils/errors';
import { PermissionsService } from '../permissions/service';
import { QuestionsService } from '../questions/service';
import { ResponseService } from '../response/service';
import { StatisticsService } from '../statistics/service';
import { IPollSection, PollDocument } from './interface';
import { pollservice } from './service';

export class pollsManager {
    static async createOne(body: any) {
        const poll = await pollservice.createOne(body);
        const setAsOwner = await PermissionsService.createOne(poll._id, body.createdBy);
        if (!setAsOwner) throw ServiceError.unauthorized();
        return poll;
    }

    static async deleteOne(id: string) {
        const poll = await pollservice.getById(id);
        const questionIds = poll.sections?.flatMap((section: any) => section.questions) || [];
        const isPublished = await PermissionsService.getPublishRequest(poll._id);

        if (isPublished) {
            await StatisticsService.deleteOne(id);
            const hasResponses = await ResponseService.hasResponses(id);
            if (hasResponses) {
                await ResponseService.deleteAllByPollId(id);
            }
        }
        if (questionIds.length !== 0) {
            await QuestionsService.deleteManyByIds(questionIds);
        }
        await PermissionsService.deleteOne(id);
        return pollservice.deleteOne(id);
    }
    static async getpolls(pollsId: [string]) {
        const poll = await pollservice.getManyById(pollsId);
        return poll;
    }

    static async getpoll(pollsId: string) {
        const poll = await pollservice.getById(pollsId);
        return poll;
    }

    static async getFull(pollsId: string) {
        const poll = await pollservice.getById(pollsId);
        const populatedPoll = await this.populatePoll(poll);
        return populatedPoll;
    }

    static async populatePoll(poll: any) {
        const allQuestionIds = poll.sections?.flatMap((section: IPollSection) => section.questions ?? []) || [];
        const allQuestions = allQuestionIds.length > 0 ? await QuestionsService.getByIds(allQuestionIds) : [];
        const questionMap = new Map(allQuestions.map((q) => [q._id.toString(), q]));
        const enrichedSections =
            poll.sections?.map((section) => ({
                ...section,
                questions: (section.questions ?? []).map((questionId) => questionMap.get(questionId)).filter(Boolean),
            })) || [];
        return {
            ...poll,
            sections: enrichedSections,
        };
    }
    static async addSection(pollId: string) {
        return pollservice.addSection(pollId);
    }

    static async getAll(genesisId: string) {
        const { owner, editor } = await PermissionsService.getAllPolls(genesisId, {
            owner: true,
            editor: true,
        });
        const ownerPolls = await Promise.all((await this.getpolls(owner)).map((p: any) => this.populatePoll(p)));
        const editorPolls = await Promise.all((await this.getpolls(editor)).map((p: any) => this.populatePoll(p)));
        return { owner: ownerPolls, editor: editorPolls };
    }

    static async updateOne(pollId: string, update: Partial<PollDocument>) {
        return pollservice.updateOne(pollId, update);
    }
    static async deleteSection(pollId: string, sectionId: string) {
        const poll = await pollservice.getById(pollId);
        const section = poll.sections?.find((s: any) => s._id?.toString() === sectionId);
        const questionIds = section?.questions || [];

        if (questionIds.length > 0) {
            await QuestionsService.deleteManyByIds(questionIds);
        }

        return pollservice.deleteSection(pollId, sectionId);
    }
}
