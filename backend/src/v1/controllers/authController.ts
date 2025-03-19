import { Response, Request } from 'express';
import {
    UserLoginInputSchema,
    UserRegisterInputSchema,
    User
} from '../models/user';
import { instanceToPlain } from 'class-transformer';
import { DataResponse, ErrorResponse } from '../models/response';
import { userLogin, userRegister } from '../services/authService';
import { ServiceErrorCodes } from '../models/error';
import { validateBody } from '../utils/validate';

export async function login(req: Request, res: Response) {
    const result = await userLogin({
        email: req.params.email,
        password: req.params.password
    });

    if (result instanceof User) {
        res.status(200).json(
            instanceToPlain<DataResponse<any>>({
                endpoint: 'auth/login',
                version: 'v1',
                timestamp: new Date(),
                status: {
                    code: 200,
                    message: 'OK',
                    success: true
                },
                data: instanceToPlain<User>(result)
            })
        );
    } else {
        let response: ErrorResponse = {
            endpoint: 'auth/login',
            version: 'v1',
            timestamp: new Date(),
            status: {
                code: 500,
                message: 'Internal Server Error',
                success: false
            },
            error: {
                code: 'ServerError',
                message: 'Internal Server Error'
            }
        };

        if (result.code === ServiceErrorCodes.UserNotFound) {
            response.status.code = 404;
            response.status.message = 'Not Found';
            response.error.code = 'UserNotFound';
            response.error.message = 'User not found.';
        }

        res.status(response.status.code).json(
            instanceToPlain<ErrorResponse>(response)
        );
    }
}

export async function register(req: Request, res: Response) {
    const result = await userRegister({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    if (result instanceof User) {
        res.status(201).json(
            instanceToPlain<DataResponse<any>>({
                endpoint: 'auth/register',
                version: 'v1',
                timestamp: new Date(),
                status: {
                    code: 201,
                    message: 'Created',
                    success: true
                },
                data: instanceToPlain<User>(result)
            })
        );
    } else {
        let response: ErrorResponse = {
            endpoint: 'auth/register',
            version: 'v1',
            timestamp: new Date(),
            status: {
                code: 500,
                message: 'Internal Server Error',
                success: false
            },
            error: {
                code: 'ServerError',
                message: 'Internal Server Error'
            }
        };

        if (result.code === ServiceErrorCodes.DuplicateUsername) {
            response.status.code = 409;
            response.status.message = 'Conflict';
            response.error.code = 'UserAlreadyExists';
            response.error.message = 'Username already exists.';
        } else if (result.code === ServiceErrorCodes.DuplicateEmail) {
            response.status.code = 409;
            response.status.message = 'Conflict';
            response.error.code = 'EmailAlreadyExists';
            response.error.message = 'Email already exists.';
        }

        res.status(response.status.code).json(
            instanceToPlain<ErrorResponse>(response)
        );
    }
}

export const validateLogin = (
    req: Request,
    res: Response,
    next: Function
): void | Promise<void> => {
    // Joi doesn't handle missing request bodies
    if (!validateBody(req, res)) return;

    const { error } = UserLoginInputSchema.validate(req.body, {
        abortEarly: false
    });
    if (error) {
        res.status(400).json(
            instanceToPlain<ErrorResponse>({
                endpoint: 'auth/login',
                version: 'v1',
                timestamp: new Date(),
                status: {
                    code: 400,
                    message: 'Bad Request',
                    success: false
                },
                error: {
                    code: 'ValidationError',
                    message: 'Validation failed.',
                    details: error.details.map((item) => {
                        return { message: item.message };
                    })
                }
            })
        );

        return;
    }

    next();
};

export const validateRegister = (
    req: Request,
    res: Response,
    next: Function
): void | Promise<void> => {
    // Joi doesn't handle missing request bodies
    if (!validateBody(req, res)) return;

    const { error } = UserRegisterInputSchema.validate(req.body, {
        abortEarly: false
    });
    if (error) {
        res.status(400).json(
            instanceToPlain<ErrorResponse>({
                endpoint: 'auth/register',
                version: 'v1',
                timestamp: new Date(),
                status: {
                    code: 400,
                    message: 'Bad Request',
                    success: false
                },
                error: {
                    code: 'ValidationError',
                    message: 'Validation failed.',
                    details: error.details.map((item) => {
                        return { message: item.message };
                    })
                }
            })
        );

        return;
    }

    next();
};
