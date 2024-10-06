import { Request, Response } from "express";
import { AuthService } from "../services/user.service";
import { CustomError, RegisterUserDto, LoginUserDto, ModifyUserDto, PaginationDto } from "../../domain";
import { envs } from "../../config";

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

        console.log('Error', error);
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
        const link = `${envs.FRONTEND_URL}/auth/login`;
        this.authService.validateEmail(token)
            .then((user) => res.send(`
                <html>
                  <head>
                    <title>Email Validado</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 50px; text-align: center; }
                        h1 { color: #980000; }
                        p { font-size: 18px; color: #555; }
                        button { margin-top: 20px; padding: 10px 20px; background-color: #980000; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
                        button:hover { background-color: #CC0000;  }
                        a { text-decoration: none; color: white; }
                    </style>
                  </head>
                  <body>
                    <h1>¡Correo validado correctamente!</h1>
                    <p>Gracias por validar tu correo. Ya puedes utilizar todas las funcionalidades de la plataforma.</p>
                    <button>
                    <a href=${link}>Ir a la página de inicio de sesión</a>
                    </button>
                  </body>
                </html>
            `))
            .catch((error) => this.handleError(error, res));
    }

    checkToken = (req: Request, res: Response) => {

        this.authService.checkToken(req.body.user)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    updateUser = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, modifyUserDTO] = ModifyUserDto.create({ id, ...req.body });

        if (error) return res.status(400).json({ error });

        this.authService.updateUser(modifyUserDTO!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    getUsers = (req: Request, res: Response) => {
        const query = typeof req.query.q === 'string' ? req.query.q : '';
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 5;
        
        this.authService.getUsers(query, limit)
            .then((users) => res.json(users))
            .catch((error) => this.handleError(error, res));
    }

    getUser = (req: Request, res: Response) => {
        const { id } = req.params;
        this.authService.getUserById(id)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    }

    deleteUser = (req: Request, res: Response) => {
        const { id } = req.params;
        this.authService.deleteUser(id)
            .then(() => res.json('Usuario dado de baja'))
            .catch((error) => this.handleError(error, res));
    }


}