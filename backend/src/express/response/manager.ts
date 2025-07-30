import { ServiceError } from '../../utils/errors';
import { KartoffelService } from '../kartoffel/service';
import { PermissionsService } from '../permissions/service';
import { pollsManager } from '../polls/manager';
import { QuestionsService } from '../questions/service';
import { StatisticsService } from '../statistics/service';
import { IResponse } from './interface';
import { ResponseService } from './service';

export class ResponsesManager {
    static async createOne(body: IResponse) {
        const isPublished = await PermissionsService.getPublishRequest(body.pollId);
        if (!isPublished) throw ServiceError.pollNotPublished();

        const questionIds = body.answers?.map((r: any) => r.questionId) || [];

        const results = await Promise.all(questionIds.map((id: string) => QuestionsService.getById(id)));
        results.forEach((q) => {
            if (!q) throw ServiceError.questionNotFound();
        });

        const savedResponse = await ResponseService.createOne(body);

        const updateData = body.answers.map((a: any) => ({
            questionId: a.questionId,
            selectedOption: Array.isArray(a.answer) ? a.answer : [a.answer],
        }));

        await StatisticsService.updateOne(body.pollId, updateData);

        return savedResponse;
    }

    static async getRespondentsByPollId(pollId: string) {
        const { respondentIds: respondents } = (await ResponseService.getRespondentsByPollId(pollId)).data;
        const respondentIds = respondents.map((r) => r.respondentId);

        type User = { id: string; fullName?: string; mail?: string };

        const users: User[] = await KartoffelService.getUsersByIds(respondentIds);
        const usersMap = new Map(users.map((user) => [user.id, user]));

        return respondents.map((res) => {
            const user = usersMap.get(res.respondentId);
            return {
                respondentId: res.respondentId,
                name: user?.fullName || '',
                mail: user?.mail || '',
                timeStamp: res.timestamp,
            };
        });
    }

    static async canRespond(pollId: string, genesisId: string) {
        const response = await ResponseService.hasUserResponded(pollId, genesisId);

        return {
            hasAccess: true,
            hasResponded: response.hasResponded,
        };
    }
    static async getByPollId(pollId: string, genesisId: string) {
        const permissions = await PermissionsService.getPollPermissions(pollId);

        const result = {
            hasAccess: false,
            respondable: false,
            hasResponded: false,
            poll: null,
        };

        if (!permissions.publish) {
            return { ...result, reason: 'notPublished' };
        }

        if (!permissions.respondable) {
            return { ...result, reason: 'notRespondable' };
        }
        if (!permissions.access) {
            const user = await KartoffelService.getUserById(genesisId);
            const isUserAllowed =
                permissions.accessUsers.some((u) => u.userId === genesisId) ||
                permissions.accessHierarchy.some((h) => user.hierarchyIds.includes(h.groupId)) ||
                permissions.owner._id === genesisId;

            if (!isUserAllowed) {
                return { ...result, reason: 'noAccess' };
            }
        }

        const canRespond = await this.canRespond(pollId, genesisId);
        if (!canRespond.hasAccess) {
            return { ...result, reason: 'alreadyResponded', hasResponded: true };
        }

        const poll = await pollsManager.getFull(pollId);
        return {
            hasAccess: true,
            respondable: true,
            hasResponded: canRespond.hasResponded,
            poll,
        };
    }
}
