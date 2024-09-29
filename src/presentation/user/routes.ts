import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
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
    
   const authService: AuthService = new AuthService(emailService);

    const controller = new AuthController(authService);

    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);
    router.get('/check-token', [ AuthMiddleware.validateJWT ],controller.checkToken);
    router.put('/update/:dni', controller.updateUser);
    router.get('/', controller.getUsers);
    router.get('/:dni', controller.getUser);



    return router;
  }


}