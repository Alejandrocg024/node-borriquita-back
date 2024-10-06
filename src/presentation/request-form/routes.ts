import { Router } from 'express';
import { RequestFormController } from './controller';
import { EmailService, RequestFormService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { envs } from '../../config';

export class RequestFormRoutes {

  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
    );

    const requestFormService = new RequestFormService(emailService);
    const controller = new RequestFormController(requestFormService);

    router.get('/', controller.getRequestForms);
    router.get('/:id', [ AuthMiddleware.checkUser ],controller.getRequestForm);
    router.post('/',controller.createRequestForm);
    router.post('/:id', [ AuthMiddleware.checkUser ],controller.createAnswer);

    return router;
  }


}