export class ApplicationError extends Error {
    constructor(
        message: string,
        public statusCode: number
    ) {
        super(message);
        this.name = 'ApplicationError';
    }
}