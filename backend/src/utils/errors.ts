export class ServiceError extends Error {
    constructor(public code: number, message: string) {
        super(message);
        this.name = 'ServiceError';
    }

    static invalidToken() {
        return new ServiceError(401, 'Invalid token');
    }
    static userNotFound() {
        return new ServiceError(404, `user not found`);
    }
    static pollNotFound() {
        return new ServiceError(404, `Poll not found`);
    }
    static questionNotFound() {
        return new ServiceError(404, 'Question not found');
    }
    static unauthorized() {
        return new ServiceError(403, 'Unauthorized');
    }
    static alreadyPublished() {
        return new ServiceError(403, 'survey has already been published');
    }
    static pollNotPublished() {
        return new ServiceError(403, 'Poll is not published');
    }
    static noQuestionsFound() {
        return new ServiceError(404, 'No questions found');
    }
    static permissionNotFound() {
        return new ServiceError(404, 'Permission not found');
    }
    static noAccessToPoll() {
        return new ServiceError(403, 'User does not have access to this poll');
    }

    static cannotRespondToPoll() {
        return new ServiceError(403, 'User is not allowed to respond to this poll');
    }
    static pollNotRespondable() {
        return new ServiceError(403, 'Poll is published but not open for responses');
    }
}
