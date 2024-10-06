import { Router } from 'express';
import { AnnouncementRoutes, EventRoutes, PayRoutes, RequestFormRoutes, UserRoutes } from '.';
import { FileUploadRoutes } from './file-upload/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    router.use('/api/event', EventRoutes.routes);
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/pay',  PayRoutes.routes);
    router.use('/api/announcement', AnnouncementRoutes.routes);

    router.use('/api/upload', FileUploadRoutes.routes);
    
    router.use('/api/requestForm', RequestFormRoutes.routes);
    
    return router;
  }


}