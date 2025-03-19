import { Router } from 'express';
import {
    login,
    register,
    validateLogin,
    validateRegister
} from '../controllers/authController';

const authRoute = Router();

authRoute.post('/login', validateLogin, login);
authRoute.post('/register', validateRegister, register);

export default authRoute;
