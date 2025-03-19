export abstract class AbstractResponse {
    endpoint: string;
    version: string;
    timestamp: Date;
    status: StatusMetadata;

    constructor(endpoint: string, version: string, status: StatusMetadata) {
        this.endpoint = endpoint;
        this.version = version;
        this.timestamp = new Date();
        this.status = status;
    }
}

export class ErrorResponse extends AbstractResponse {
    error: ErrorMetadata;

    constructor(
        endpoint: string,
        version: string,
        status: StatusMetadata,
        error: ErrorMetadata
    ) {
        super(endpoint, version, status);
        this.error = error;
    }
}

export class DataResponse<T> extends AbstractResponse {
    data: T;

    constructor(
        endpoint: string,
        version: string,
        status: StatusMetadata,
        data: T
    ) {
        super(endpoint, version, status);
        this.data = data;
    }
}

export class StatusMetadata {
    code: number;
    message: string;
    success: boolean;

    constructor(code: number, message: string, success: boolean) {
        this.code = code;
        this.message = message;
        this.success = success;
    }
}

export class ErrorMetadata {
    code: string;
    message: string;
    details?: any;

    constructor(code: string, message: string, details?: any) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}
