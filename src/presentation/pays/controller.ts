import { Request, Response } from "express";
import { PayService } from "../services";
import { CustomError, PaginationDto } from "../../domain";

export class PayController {

    // DI
    constructor(
        private readonly payService: PayService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.StatusCode).json({error: error.message});
        }

        console.error(`${error}`);
        return res.status(500).json({error: 'Error Interno del Servidor'});
    }

    getPays = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        this.payService.getPays( paginationDto! )
            .then( (pays) => res.json(pays) ) 
            .catch( (error) => this.handleError(error, res) );
    }

}