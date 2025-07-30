import { pollservice } from '../polls/service';
import { QuestionsService } from '../questions/service';
import { QuestionType } from './interface';
import { StatisticsService } from './service';
import { ServiceError } from '../../utils/errors';

export class StatisticsManager {
    static async getStatistics(pollId: string) {
        return StatisticsService.getByPollId(pollId);
    }
    static async createOne(pollId: string) {
        const poll = await pollservice.getById(pollId);
        const questionIds = poll.sections?.flatMap((s: any) => s.questions) || [];
        if (!questionIds || questionIds.length === 0) {
            throw ServiceError.noQuestionsFound();
        }
        const questions = await QuestionsService.getByIds(questionIds);

        const questionStats = questions.map((q: any) => ({
            questionId: q._id,
            questionType: q.type as QuestionType,
            optionAnswerCounts:
                q.options?.map((opt) => ({
                    _id: opt._id,
                    option: opt.option,
                })) || [],
        }));

        return StatisticsService.createOne({ pollId, questionStats });
    }
}
