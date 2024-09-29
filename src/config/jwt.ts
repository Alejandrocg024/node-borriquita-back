import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;


export const JwtAdapter = {

    generateToken (payload:any, duration:string = '1h') {

        return new Promise((resolve) => {
            jwt.sign(payload,JWT_SEED, { expiresIn: duration }, 
                (error, token) => {
                    if(error) throw resolve(null);
                    resolve(token);
                });
        });
    },

    validateToken<T>(token:string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if(error) throw resolve(null);
                resolve(decoded as T);
            });
        });
    }
};
