import { Router } from 'express';
import { AnnouncementController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AnnouncementService } from '../services/announcement.service';

export class AnnouncementRoutes {

  static get routes(): Router {

    const router = Router();
     
    const announcementService: AnnouncementService = new AnnouncementService();
    const controller = new AnnouncementController(announcementService);

    router.get('/', controller.getAnnouncements);
    router.get('/:id', [ AuthMiddleware.checkUser ],controller.getAnnouncement);
    router.post('/', [ AuthMiddleware.validateComm ],controller.createAnnouncement);
    router.put('/:id', [ AuthMiddleware.validateComm ],controller.updateAnnouncement);
    router.delete('/:id', [ AuthMiddleware.validateComm ],controller.deleteAnnouncement);
    
    return router;
  }
}