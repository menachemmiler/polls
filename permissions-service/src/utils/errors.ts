// eslint-disable-next-line max-classes-per-file
export class ServiceError extends Error {
    constructor(
        public code: number,
        message: string,
    ) {
        super(message);
    }
}

export class DocumentNotFoundError extends ServiceError {
    constructor(id: string) {
        super(404, `No permissions found with pollId ${id}`);
    }
}
export class DuplicateDocumentError extends ServiceError {
    constructor(id: string) {
        super(409, `A permissions with pollId ${id} already exists.`);
        
    }
}

