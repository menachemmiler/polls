/* eslint-disable max-classes-per-file */
export class ServiceError extends Error {
    constructor(
        public code: number,
        message: string,
    ) {
        super(message);
    }
}

export class PollNotFoundError extends ServiceError {
    constructor(id: string) {
        super(404, `No document found with id ${id}`);
    }
}

export class DuplicatePollResponseError extends ServiceError {
    constructor(respondentId: string, pollId: string) {
        super(409, `Respondent '${respondentId}' has already submitted a response for poll '${pollId}'`);
    }
}
