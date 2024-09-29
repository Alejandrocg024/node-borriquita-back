import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, ModifyUserDto, PaginationDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';

export class AuthService {

    constructor(
        private readonly emailService: EmailService
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const { email } = registerUserDto;

        const existUser = await UserModel.findOne({ email });
        if (existUser) throw CustomError.badRequest('Email ya en uso');

        const existDni = await UserModel.findOne({ dni: registerUserDto.dni });
        if (existDni) throw CustomError.badRequest('DNI ya en uso');

        try {
            const user = new UserModel(registerUserDto);

            //Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);

            //JWT para mantener la autenticación del usuario
            const token = await JwtAdapter.generateToken({ id: userEntity.id });
            if (!token) throw CustomError.internalServer('Error generando token');

            //Enviar email de validación
            await this.sendEmailValidation(userEntity.email);

            return {
                user: userEntity,
                token: token
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const { dni, password } = loginUserDto;

        const existUser = await UserModel.findOne({ dni });
        if (!existUser) throw CustomError.notFound('Usuario no encontrado');

        //Comparar la contraseña
        const isPasswordValid = bcryptAdapter.compare(password, existUser.password);
        if (!isPasswordValid) throw CustomError.badRequest('Contraseña incorrecta');
        
        const { password: _, ...userEntity } = UserEntity.fromObject(existUser);

        const token = await JwtAdapter.generateToken({ id: userEntity.id }, '10h');
        if (!token) throw CustomError.internalServer('Error generando token');

        return {
            user: userEntity,
            token: token
        };

    }

    async getUsers( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;

        try {
            const [ total, users ] = await Promise.all([
                UserModel.countDocuments(),
                UserModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            return {
                page,
                limit,
                total,

                next: `/api/user?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/user?page=${ ( page - 1 ) }&limit=${ limit }`: null,
                

                users: users.map( user => UserEntity.fromObject(user) ),
            }
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async getUser( dni: string ) {

        try {
            const user = await UserModel.findOne({ dni });
            if (!user) throw CustomError.notFound('Usuario no encontrado');

            return {
                user: UserEntity.fromObject(user)
            }
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    public async updateUser(modifyUserDto: ModifyUserDto) {
        const { dni } = modifyUserDto;

        const user = await UserModel.findOne({ dni });
        if (!user) throw CustomError.notFound('Usuario no encontrado');

        try {
            for (const key in modifyUserDto) {
                if (modifyUserDto[key as keyof ModifyUserDto]) {
                    (user as any)[key] = modifyUserDto[key as keyof ModifyUserDto];
                }
            }
            
            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return userEntity;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async checkToken(user: UserEntity) {
        // const payload = await JwtAdapter.validateToken(token);
        // if (!payload) throw CustomError.unauthorized('Token de autenticación inválido');

        // const { id } = payload as { id: string };
        // if (!id) throw CustomError.internalServer('Falta el Id del usuario en el token');

        // const user = await UserModel.findById(id);
        // if (!user) throw CustomError.notFound('Token de autenticación inválido - Usuario no encontrado');
        
        // const { password: _, ...userEntity } = UserEntity.fromObject(user);

        const { password: _, ...userEntity } = user;

        const newToken = await JwtAdapter.generateToken({ id: userEntity.id }, '1h');
        if (!newToken) throw CustomError.internalServer('Error generando token');

        return {
            user: userEntity,
            token: newToken
        };


    }
        

    public async validateEmail(token: string) {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unauthorized('Token inválido');

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Falta el email en el token');

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.notFound('Email no encontrado');


        try {
            user.emailValidated = true;

            await user.save();
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }


    }

    private async sendEmailValidation(email: string) {
        const token = await JwtAdapter.generateToken({ email }, '10m');
        if (!token) throw CustomError.internalServer('Error generando token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Validación de correo electrónico</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                    background-color: #980000;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                }
                .content h2 {
                    font-size: 20px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .button-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                }
                .button:hover {
                    background-color: #45a049;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                }
                .image-container {
                    text-align: center; /* Centro de la imagen */
                    margin: 20px 0;
                }
                .image-container img {
                    width: 180px;
                    height: 180px;
                    object-fit: cover; /* Asegura que la imagen se ajuste al tamaño sin distorsión */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Hermandad Sacramental de la Borriquita</h1>
                </div>
                <div class="content">
                    </div>
                    <h2>¡Hola, ${email}!</h2>
                    <p>Hemos aprobado tu solicitud para darte de alta como hernano. Para completar el proceso de registro, necesitamos que confirmes tu dirección de correo electrónico. Haz clic en el botón de abajo para verificar tu cuenta.</p>
    
                    <div class="button-container">
                        <a href="${link}" class="button">Verificar mi correo</a>
                    </div>
    
                    <p>Si no has solicitado este registro, puedes ignorar este correo.</p>
                </div>
                <div class="footer">
                    <p>© 2024 Hermandad Sacramental de la Borriquita</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const options = {
            to: email,
            subject: 'Hermandad de la Borriquita - Verificación de correo electrónico',
            htmlBody: html,
        };

        const emailSent = await this.emailService.sendEmail(options);

        if (!emailSent) throw CustomError.internalServer('Error enviando email de validación');

        return true;
    }
}