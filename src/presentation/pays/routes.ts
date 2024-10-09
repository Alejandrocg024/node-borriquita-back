import { Router } from 'express';
import { PayController } from './controller';
import { PayService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export class PayRoutes {

  static get routes(): Router {

    const router = Router();

    const payService = new PayService();
    const controller = new PayController(payService);

    router.get('/', controller.getPays);
    router.get('/:id', [AuthMiddleware.checkUser], controller.getPay);
    router.post('/', [AuthMiddleware.validateMay], controller.createPay);
    router.delete('/:id', [AuthMiddleware.validateMay], controller.deletePay);

    router.put('/:id', [AuthMiddleware.checkUser], controller.checkout);
    router.get('/accept/:token', [AuthMiddleware.validateMay], controller.acceptPay);

    return router;
  }


}