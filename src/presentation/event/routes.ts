import { Router } from 'express';
import { EventService } from '../services';
import { EventController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class EventRoutes {

  static get routes(): Router {

    const router = Router();

    const eventService = new EventService();
    const controller = new EventController(eventService);

    router.get('/', controller.getEvents);
    router.get('/:id',controller.getEvent);
    router.post('/', [ AuthMiddleware.validateComm ], controller.createEvent);
    router.put('/:id', [ AuthMiddleware.validateComm ],controller.updateEvent);
    router.delete('/:id', [ AuthMiddleware.validateComm ],controller.deleteEvent);

    return router;
  }


}