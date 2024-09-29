import { Request, Response } from "express";
import { AuthService } from "../services/user.service";
import { CustomError, RegisterUserDto, LoginUserDto, ModifyUserDto, PaginationDto } from "../../domain";

export class AuthController {

    // DI
    constructor(
        public readonly authService: AuthService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.StatusCode).json({ error: error.message });
        }

        console.error(`${error}`);
        return res.status(500).json({ error: 'Error Interno del Servidor' });
    }

    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.authService.registerUser(registerUserDto!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.authService.loginUser(loginUserDto!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;
        this.authService.validateEmail(token)
            .then((user) => res.json('Email validado'))
            .catch((error) => this.handleError(error, res));
    }

    checkToken = (req: Request, res: Response) => {
        // const authorization = req.header('Authorization');
        // if(!authorization) return res.status(401).json({error: 'Falta el token de autenticación'});
        // if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Token de autenticación inválido'});

        // const token = authorization.split(' ')[1] || '';
        // if(!token) return res.status(401).json({error: 'Falta el token de autenticación'});


        this.authService.checkToken(req.body.user)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    updateUser = (req: Request, res: Response) => {
        const { dni } = req.params;
        req.body.dni = dni;
        const [error, modifyUserDTO] = ModifyUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.authService.updateUser(modifyUserDTO!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    getUsers = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.authService.getUsers(paginationDto!)
            .then((users) => res.json(users))
            .catch((error) => this.handleError(error, res));
    }

    getUser = (req: Request, res: Response) => {
        const { dni } = req.params;
        this.authService.getUser(dni)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }


}