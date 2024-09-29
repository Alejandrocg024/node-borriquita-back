import { Router } from 'express';
import { PayController } from './controller';
import { PayService } from '../services';

export class PayRoutes {

  static get routes(): Router {

    const router = Router();

    const payService = new PayService();
    const controller = new PayController(payService);

    router.get('/', controller.getPays );

    return router;
  }


}