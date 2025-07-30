export class ServiceError extends Error {
    constructor(
        public code: number,
        message: string,
        public metadata: any = {},
    ) {
        super(message);
        this.code = code;
        this.metadata = metadata;
    }
}

export class NotFoundError extends ServiceError {
    constructor(entity: string, metadata: any = {}) {
        super(404, `${entity} not found`, metadata);
    }
}
