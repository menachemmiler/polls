import { ServiceError } from '../../utils/errors';
import { PermissionsService } from '../permissions/service';
import { pollservice } from '../polls/service';
import { ResponseService } from '../response/service';
import { StatisticsService } from '../statistics/service';
import { Question } from './interface';
import { QuestionsService } from './service';

export class QuestionsManager {
    static async createOne(body: Question & { index?: number }) {
        const { pollId, sectionId, index, ...questionData } = body;

        const poll = await pollservice.getById(pollId);
        if (!poll._id) throw ServiceError.pollNotFound();

        const created = await QuestionsService.createOne(questionData);

        const section = poll.sections?.find((s) => s._id?.toString() === sectionId);
        const sectionQuestionsCount = section?.questions?.length || 0;
        const targetIndex = index ?? sectionQuestionsCount;

        await pollservice.attachQuestion(pollId, created._id, sectionId, targetIndex);

        const isPublished = await PermissionsService.getPublishRequest(pollId);

        if (isPublished) {
            await StatisticsService.updateForm(pollId, {
                questionId: created._id,
                questionType: created.type,
                options:
                    created.options?.map((opt: any) => ({
                        _id: opt._id,
                        option: opt.option,
                    })) ?? [],
            });
        }

        return created;
    }

    static async deleteOne({ pollId, sectionId, questionId }: { pollId: string; sectionId: string; questionId: string }) {
        const answers = await ResponseService.getAnswersByQuestionId(questionId);
        if (answers.length > 0) {
            await ResponseService.deleteByQuestion(pollId, questionId);
        }
        const isPublished = await PermissionsService.getPublishRequest(pollId);
        if (isPublished) {
            await StatisticsService.deleteQuestion(pollId, questionId);
        }
        await pollservice.detachQuestion(pollId, sectionId, questionId);
        const deleted = await QuestionsService.deleteOne(questionId);

        return deleted;
    }
    static async updateQuestion(questionId: string, update: Partial<Question>) {
        const updated = await QuestionsService.updateOne(questionId, update);
        const isPublished = await PermissionsService.getPublishRequest(update.pollId!);

        if (isPublished) {
            await StatisticsService.updateForm(update.pollId!, {
                questionId: updated._id,
                questionType: updated.type,
                options:
                    updated.options?.map((opt: any) => ({
                        _id: opt._id,
                        option: opt.option,
                    })) ?? [],
            });
        }

        return updated;
    }
}
