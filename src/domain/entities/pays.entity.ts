import { CustomError } from "../errors/custom.error";

export class PayEntity {
    constructor(
        public id: string,
        public user: string,
        public information: string,
        public quantity: number,
        public startDate: Date,
        public state: string,
        public finishDate?: Date,
        public payMethod?: string,
    ){}


    static fromObject(obj: { [key:string]: any}): PayEntity {
            const { id, _id, user, information, quantity, startDate, state, finishDate, payMethod } = obj;

            if( !_id && !id ) throw CustomError.badRequest('Falta el ID');

            if( !user ) throw CustomError.badRequest('Falta el usuario');

            if( !information ) throw CustomError.badRequest('Falta la información');

            if( !quantity ) throw CustomError.badRequest('Falta la cantidad');

            if( !startDate ) throw CustomError.badRequest('Falta la fecha de inicio');

            if( !state ) throw CustomError.badRequest('Falta el estado');

            return new PayEntity(id || _id, user, information, quantity, startDate, state, finishDate, payMethod);
    }
}