import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService, PayService } from '../services';
import { envs } from '../../config';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class UserRoutes {

  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
    );

    const payService = new PayService();
    const authService: AuthService = new AuthService(emailService, payService);

    const controller = new AuthController(authService);

    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);
    router.get('/check-token', [AuthMiddleware.validateJWT], controller.checkToken);

    router.get('/:id', controller.getUser);
    router.get('/', controller.getUsers);
    router.put('/update/:id', controller.updateUser);
    router.delete('/delete/:id', controller.deleteUser);

    return router;
  }


}