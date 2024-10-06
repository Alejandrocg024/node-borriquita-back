import { Request, Response } from "express";
import { CreateAnnouncementDto, CustomError, PaginationDto } from "../../domain";
import { AnnouncementService } from "../services/announcement.service";
import { UpdateAnnouncementDto } from "../../domain/dtos/announcements/update-announcement.dto";

export class AnnouncementController {

    
    // DI
    constructor(
        private readonly announcementService: AnnouncementService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.StatusCode).json({error: error.message});
        }

        console.error(`${error}`);
        return res.status(500).json({error: 'Error Interno del Servidor'});
    }

    getAnnouncements = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        this.announcementService.getAnnouncements( paginationDto! )
            .then( (announcements) => res.json(announcements) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    getAnnouncement = (req: Request, res: Response) => {
        const { id } = req.params;
        const userRole = req.body.user?.role;

        console.log('User role: ', userRole);
        this.announcementService.getAnnouncement(id)
            .then( (ann) => {
                // if (!ann?.available && (userRole !== 'MAYORDOMIA_ROLE' || userRole !== 'COMUNICACIONES_ROLE')) {
                //     console.log('No tienes permisos para ver esta noticia');
                //     return res.status(401).json({error: 'No tienes permisos para ver esta noticia'});
                // }
                return res.json(ann);
            }  )
            .catch( (error) => this.handleError(error, res) );
    }

    createAnnouncement = (req: Request, res: Response) => {
        const [error, createAnnouncementDto] = CreateAnnouncementDto.create(req.body);


        if(error) return res.status(400).json({error});

        this.announcementService.createAnnouncement(createAnnouncementDto!, req.body.user)
            .then( (announcement) => res.json(announcement) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    updateAnnouncement = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateAnnouncementDto] = UpdateAnnouncementDto.create({id, ...req.body});

        if(error) return res.status(400).json({error});

        this.announcementService.updateAnnouncement(updateAnnouncementDto!, req.body.user)
            .then( (announcement) => res.json(announcement) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    deleteAnnouncement = (req: Request, res: Response) => {
        const { id } = req.params;
        this.announcementService.deleteAnnouncement(id)
            .then( () => res.json('Noticia borrada') ) 
            .catch( (error) => this.handleError(error, res)  );
    }

}