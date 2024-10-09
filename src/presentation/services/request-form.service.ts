import { envs } from '../../config';
import { RequestFormModel } from '../../data';
import { CustomError, PaginationDto, RequestFormEntity, UserEntity } from '../../domain';
import { CreateAnswerFormDto } from '../../domain/dtos/request-form/create-answer-form.dto';
import { CreateRequestFormDto } from '../../domain/dtos/request-form/create-request-form.dto';
import { EmailService } from './email.service';

export class RequestFormService {
    constructor(
        private readonly emailService: EmailService
    ) { }

    async getRequestForms(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, requestForms] = await Promise.all([
                RequestFormModel.countDocuments(),
                RequestFormModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            return {
                page,
                limit,
                total,

                next: `/api/requestForm?page=${(page + 1)}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/requestForm?page=${(page - 1)}&limit=${limit}` : null,

                announcements: requestForms.map(requestForm => RequestFormEntity.fromObject(requestForm)),
            }
        } catch (error) {
            throw CustomError.internalServer((error as Error).message);
        }
    }

    async getRequestForm(id: string) {
        const pay = await RequestFormModel.findById(id).populate('user');
        if (!pay) throw CustomError.notFound('Solicitud no encontrada');

        try {


            return RequestFormEntity.fromObject(pay)
        } catch (error) {
            throw CustomError.internalServer((error as Error).message);
        }
    }

    async createRequestForm(createRequestFormDto: CreateRequestFormDto) {

        try {
            const req = new RequestFormModel(createRequestFormDto);

            await req.save();

            await this.sendEmailRequest(createRequestFormDto);

            return RequestFormEntity.fromObject(req);
        } catch (error) {
            throw CustomError.internalServer((error as Error).message);
        }
    }

    async createAnswerForm(createAnswerFormDto: CreateAnswerFormDto, user: UserEntity) {

        if (!user) throw CustomError.badRequest('Usuario no encontrado');

        const { requestId, ...createAnswer }: { requestId: string, [key: string]: any } = createAnswerFormDto;

        const req = await RequestFormModel.findByIdAndUpdate(requestId, {
            answer: createAnswer,
        });

        if (!req) throw CustomError.notFound('Solicitud no encontrada');

        try {

            await req.save();

            return RequestFormEntity.fromObject(req);
        } catch (error) {
            throw CustomError.internalServer((error as Error).message);
        }
    }


    private async sendEmailRequest(createRequestFormDto: CreateRequestFormDto) {

        const { email, details } = createRequestFormDto;
        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalles de la solicitud</title>
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
                .details {
                    background-color: #f9f9f9;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    font-size: 14px;
                    color: #555;
                }
                .details p {
                    margin: 5px 0;
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
                    text-align: center;
                    margin: 20px 0;
                }
                .image-container img {
                    width: 180px;
                    height: 180px;
                    object-fit: cover;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Hermandad Sacramental de la Borriquita</h1>
                </div>
                <div class="content">
                    <h2>¡Hola, ${email}!</h2>
                    <p>Hemos recibido tu solicitud con los siguientes detalles:</p>

                    <div class="details">
                        <p>${details}</p>
                    </div>
        
                    <p>Te contactaremos en breve a este correo. Si necesitas realizar algún cambio, por favor responde a este correo.</p>
        
                    <p>Gracias por confiar en nosotros.</p>
                </div>
                <div class="footer">
                    <p>© 2024 Hermandad Sacramental de la Borriquita</p>
                </div>
            </div>
        </body>
        </html>
        `;


        if (!email) throw CustomError.badRequest('Email no proporcionado');

        const options = {
            to: email,
            subject: 'Hermandad de la Borriquita - Consulta',
            htmlBody: html,
        };

        const emailSent = await this.emailService.sendEmail(options);

        if (!emailSent) throw CustomError.internalServer('Error enviando email');

        return true;
    }

}