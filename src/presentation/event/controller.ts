import { Request, Response } from "express";
import { CreateEventDto, CustomError, PaginationDto, UpdateEventDto } from "../../domain";
import { EventService } from "../services";

export class EventController {

    // DI
    constructor(
        private readonly eventService: EventService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.StatusCode).json({error: error.message});
        }

        console.error(`${error}`);
        return res.status(500).json({error: 'Error Interno del Servidor'});
    }

    getEvents = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        this.eventService.getEvents( paginationDto! )
            .then( (events) => res.json(events) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    createEvent = (req: Request, res: Response) => {
        const [error, createEventDto] = CreateEventDto.create(req.body);

        console.log(createEventDto);


        if(error) return res.status(400).json({error});

        this.eventService.createEvent(createEventDto!)
            .then( (event) => res.json(event) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    getEvent = (req: Request, res: Response) => {
        const { id } = req.params;

        this.eventService.getEvent(id)
            .then( (event) => res.json(event))
            .catch( (error) => this.handleError(error, res) );
    }

    updateEvent = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateEventDto] = UpdateEventDto.create({id, ...req.body});

        if(error) return res.status(400).json({error});

        this.eventService.updateEvent(updateEventDto!)
            .then( (event) => res.json(event) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    deleteEvent = (req: Request, res: Response) => {
        const { id } = req.params;
        this.eventService.deleteEvent(id)
            .then( () => res.json('Evento borrada') ) 
            .catch( (error) => this.handleError(error, res)  );
    }


}