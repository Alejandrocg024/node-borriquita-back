import { Request, Response } from "express";
import { PayService } from "../services";
import { CreatePayDto, CustomError, PaginationDto, UpdatePayDto } from "../../domain";




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

    getPay = (req: Request, res: Response) => {
        const { id } = req.params;

        this.payService.getPay(id)
            .then( (pay) => {
                // if (!pay?.available && (userRole !== 'MAYORDOMIA_ROLE' || userRole !== 'COMUNICACIONES_ROLE')) {
                //     return res.status(401).json({error: 'No tienes permisos para ver esta noticia'});
                // }
                return res.json(pay);
            }  )
            .catch( (error) => this.handleError(error, res) );
    }

    createPay = (req: Request, res: Response) => {
        const [error, createPayDto] = CreatePayDto.create(req.body);

        console.log('Error', createPayDto);
        if(error) return res.status(400).json({error});

        this.payService.createPay(createPayDto!)
            .then( (pay) => res.json(pay) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    updatePay = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updatePayDto] = UpdatePayDto.create({id, ...req.body});

        if(error) return res.status(400).json({error});

        this.payService.updatePay(updatePayDto!, req.body.user)
            .then( (pay) => res.json(pay) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    checkout = (req: Request, res: Response) => {
        const { id } = req.params;
        console.log('checkout');
        const [error, updatePayDto] = UpdatePayDto.create({id, ...req.body});

        if(error) return res.status(400).json({error});

        this.payService.checkout(updatePayDto!, req.body.user)
            .then( (pay) => res.json(pay) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    acceptPay = (req: Request, res: Response) => {
        const { token } = req.params;

        this.payService.cardPay(token!, req.body.user)
            .then( (pay) => res.json(pay) ) 
            .catch( (error) => this.handleError(error, res) );
    }

    deletePay = (req: Request, res: Response) => {
        const { id } = req.params;
        this.payService.deletePay(id)
            .then( () => res.json('Pago borrado') ) 
            .catch( (error) => this.handleError(error, res)  );
    }



  

}