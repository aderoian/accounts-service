import { Response, Request } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ErrorResponse } from '../models/response';

export function validateBody(req: Request, res: Response): boolean {
    if (req.body === undefined) {
        res.status(400).json(
            instanceToPlain<ErrorResponse>({
                endpoint: req.url,
                version: 'v1',
                timestamp: new Date(),
                status: {
                    code: 400,
                    message: 'Bad Request',
                    success: false
                },
                error: {
                    code: 'ValidationError',
                    message: 'Request body is missing'
                }
            })
        );
        return false;
    }

    return true;
}
