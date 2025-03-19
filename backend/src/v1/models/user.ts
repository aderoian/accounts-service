import { Exclude, Expose } from 'class-transformer';
import Joi from 'joi';

export interface UserRegisterInput {
    username: string;
    email: string;
    password: string;
}

export const UserRegisterInputSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export interface UserLoginInput {
    email: string;
    password: string;
}

export const UserLoginInputSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export class User {
    id: string;
    username: string;
    email: string;

    @Exclude({ toPlainOnly: true })
    password: string;

    @Expose({ name: 'created_at' })
    createdAt: Date;
    @Expose({ name: 'updated_at' })
    updatedAt: Date;

    constructor(
        id: string,
        username: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
