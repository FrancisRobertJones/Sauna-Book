export class ApplicationError extends Error {
    constructor(
        message: string,
        public statusCode: number
    ) {
        super(message);
        this.name = 'ApplicationError';
    }
}

interface MongoError extends Error {
    code?: number;
    keyPattern?: Record<string, number>;
    keyValue?: Record<string, unknown>;
}

export function isMongoError(error: unknown): error is MongoError {
    return error instanceof Error && 
           typeof (error as any).code === 'number';
}