export class ServiceError extends Error {
    constructor(
        public code: number,
        message: string,
    ) {
        super(message);
    }
}

export class UserNotFoundError extends ServiceError {
    constructor(id: string) {
        super(404, `No user found with id ${id}`);
    }
}
