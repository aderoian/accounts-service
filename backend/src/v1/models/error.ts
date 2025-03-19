export interface ServiceError {
    code: number;
    message: string;
}

export enum ServiceErrorCodes {
    ServerError = 0,
    DatabaseError = 1,
    ValidationError = 2,

    DuplicateEmail = 10,
    DuplicateUsername = 11,

    UserNotFound = 20
}
