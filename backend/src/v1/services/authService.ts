import { UserLoginInput, User, UserRegisterInput } from '../models/user';
import { getDBConnection } from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { plainToClass } from 'class-transformer';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ServiceError, ServiceErrorCodes } from '../models/error';

export const userLogin = async (
    UserLoginInput: UserLoginInput
): Promise<User | ServiceError> => {
    const db = await getDBConnection();

    if (!db) {
        console.error('Could not connect to database.');
        return {
            code: ServiceErrorCodes.ServerError,
            message: 'Could not connect to database.'
        };
    }

    // Fetch user from database
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?;',
        [UserLoginInput.email]
    );
    if (rows.length === 0)
        return {
            code: ServiceErrorCodes.UserNotFound,
            message: 'User not found.'
        };

    // Check if password is correct
    const user: User = plainToClass(User, rows[0]);
    if (!(await bcrypt.compare(UserLoginInput.password, user.password)))
        return {
            code: ServiceErrorCodes.UserNotFound,
            message: 'User not found.'
        };

    return user;
};

export const userRegister = async (
    userInput: UserRegisterInput
): Promise<User | ServiceError> => {
    const db = await getDBConnection();

    if (!db) {
        console.error('Could not connect to database.');
        return {
            code: ServiceErrorCodes.ServerError,
            message: 'Could not connect to database.'
        };
    }

    // Check if email or username is already in use
    const [compareRows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ? OR username = ?;',
        [userInput.email, userInput.username]
    );
    if (compareRows.length > 0) {
        for (const row of compareRows) {
            if (row.email === userInput.email)
                return {
                    code: ServiceErrorCodes.DuplicateEmail,
                    message: 'Email already in use.'
                };
            if (row.username === userInput.username)
                return {
                    code: ServiceErrorCodes.DuplicateUsername,
                    message: 'Username already in use.'
                };
        }
    }

    // Generate UUID
    const userId = uuidv4();
    // Hash password
    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    // Insert user into database
    const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?);',
        [userId, userInput.username, userInput.email, hashedPassword]
    );
    if (result.affectedRows === 0)
        return {
            code: ServiceErrorCodes.DatabaseError,
            message: 'Could not insert user into database.'
        };

    // Fetch user from database
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?;',
        [userInput.email]
    );
    if (rows.length === 0)
        return {
            code: ServiceErrorCodes.DatabaseError,
            message: 'Could not fetch user from database.'
        };

    return plainToClass(User, rows[0]);
};
