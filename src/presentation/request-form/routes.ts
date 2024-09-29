import { Router } from 'express';
import { RequestFormController } from './controller';
import { RequestFormService } from '../services';

export class RequestFormRoutes {

  static get routes(): Router {

    const router = Router();

    const requestFormService = new RequestFormService();
    const controller = new RequestFormController(requestFormService);

    router.get('/', controller.getRequestForms);

    return router;
  }


}