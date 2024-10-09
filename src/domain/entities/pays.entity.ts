import { CustomError } from "../errors/custom.error";

export type PayState = 'PENDING' | 'PAID' | 'CANCELLED';
export type PayMethod = 'CASH' | 'CARD';

export class PayEntity {
    constructor(
        public id: string,
        public user: string,
        public concept: string,
        public quantity: number,
        public startDate: Date,
        public finishDate: Date,
        public state: PayState,
        public payMethod?: PayMethod,
    ){}


    static fromObject(obj: { [key:string]: any}): PayEntity {
            const { id, _id, user, concept, quantity, startDate, finishDate, state, payMethod } = obj;

            if( !_id && !id ) throw CustomError.badRequest('Falta el ID');

            if( !user ) throw CustomError.badRequest('Falta el usuario');

            if( !concept ) throw CustomError.badRequest('Falta el concepto');

            if( !quantity ) throw CustomError.badRequest('Falta la cantidad');
            if( quantity < 0 ) throw CustomError.badRequest('La cantidad no puede ser negativa');

            if( !startDate ) throw CustomError.badRequest('Falta la fecha de inicio');

            if( !finishDate ) throw CustomError.badRequest('Falta la fecha de finalizacion');
            if ( startDate > finishDate ) throw CustomError.badRequest('La fecha de inicio no puede ser posterior a la fecha de finalizacion');

            if( !state ) throw CustomError.badRequest('Falta el estado');

            return new PayEntity(id || _id, user, concept, quantity, startDate, finishDate, state, payMethod );
    }
}