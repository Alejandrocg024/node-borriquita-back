import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";



export class AuthMiddleware {

    static async validateJWT(req: Request, res:Response, next:NextFunction) {
        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json({error: 'Falta el token de autenticación'});
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Token de autenticación inválido'});


        const token = authorization.split(' ')[1] || '';
        if(!token) return res.status(401).json({error: 'Falta el token de autenticación'});


        try {
            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if ( !payload ) return res.status(401).json({error: 'Token de autenticación inválido'});

            const { id } = payload as { id: string };
            if (!id) return res.status(401).json('Falta el Id del usuario en el token');
            
            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({error: 'Token de autenticación inválido - Usuario no encontrado'});

            req.body.user = UserEntity.fromObject(user);

            next();
        } catch (error) {
            return res.status(500).json({error: 'Error Interno del Servidor'});
        }
    }

    static async checkUser(req: Request, res:Response, next:NextFunction) {
        const authorization = req.header('Authorization');
        const token = authorization?.split(' ')[1] || ''

        try {
            if(token) {
                const payload = await JwtAdapter.validateToken<{ id: string }>(token);
                
                const user = await UserModel.findById(payload?.id);
    
                if (!user) return;
    
                req.body.user = UserEntity.fromObject(user);
            }
    
            next();
        } catch (error) {
            console.error("Validation error: ", error);
            return res.status(500).json({error: 'Error Interno del Servidor'});
        }
    }

    static async validateComm(req: Request, res:Response, next:NextFunction) {
        const roles = ['ADMIN_ROLE', 'COMUNICACIONES_ROLE'];
        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json({error: 'Falta el token de autenticación'});
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Token de autenticación inválido'});


        const token = authorization.split(' ')[1] || '';
        if(!token) return res.status(401).json({error: 'Falta el token de autenticación'});

        try {
            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if ( !payload ) return res.status(401).json({error: 'Token de autenticación inválido'});
            
            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({error: 'Token de autenticación inválido - Usuario no encontrado'});

            req.body.user = UserEntity.fromObject(user);
            if(!user.role || !roles.includes(user.role)) return res.status(401).json({error: 'No autorizado'});
    
            next();
        } catch (error) {
            console.error("Validation error: ", error);
            return res.status(500).json({error: 'Error Interno del Servidor'});
        }
    }

    static async validateMay(req: Request, res:Response, next:NextFunction) {
        const roles = ['ADMIN_ROLE', 'MAYORDOMIA_ROLE'];
        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json({error: 'Falta el token de autenticación'});
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Token de autenticación inválido'});


        const token = authorization.split(' ')[1] || '';
        if(!token) return res.status(401).json({error: 'Falta el token de autenticación'});

        try {
            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if ( !payload ) return res.status(401).json({error: 'Token de autenticación inválido'});
            
            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({error: 'Token de autenticación inválido - Usuario no encontrado'});

            req.body.user = UserEntity.fromObject(user);
            if(!user.role || !roles.includes(user.role)) return res.status(401).json({error: 'No autorizado'});
    
            next();
        } catch (error) {
            console.error("Validation error: ", error);
            return res.status(500).json({error: 'Error Interno del Servidor'});
        }
    }
}