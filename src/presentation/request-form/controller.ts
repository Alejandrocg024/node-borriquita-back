import { Request, Response } from "express";
import { CreateAnnouncementDto, CustomError, PaginationDto } from "../../domain";
import { AnnouncementService } from "../services/announcement.service";
import { RequestFormService } from "../services";

export class RequestFormController {

    // DI
    constructor(
        private readonly requestFormService: RequestFormService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.StatusCode).json({error: error.message});
        }

        console.error(`${error}`);
        return res.status(500).json({error: 'Error Interno del Servidor'});
    }

    getRequestForms = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        this.requestFormService.getRequestForms( paginationDto! )
            .then( (requestForms) => res.json(requestForms) ) 
            .catch( (error) => this.handleError(error, res) );
    }

}