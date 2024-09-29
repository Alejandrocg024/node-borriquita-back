import { CustomError } from "../errors/custom.error";

interface Answer{
    user: string;
    date: Date;
    details: string;
}

export class RequestFormEntity {
    constructor(
        public id: string,
        public type: string,
        public date: Date,
        public details: string,
        public email?: string,
        public answers?: Answer[],
    ){}


    static fromObject(obj: { [key:string]: any}): RequestFormEntity {
            const { id, _id, type, date, details, email, answers } = obj;

            if( !_id && !id ) throw CustomError.badRequest('Falta el ID');

            if( !type ) throw CustomError.badRequest('Falta el tipo');

            if( !date ) throw CustomError.badRequest('Falta la fecha');

            if( !details ) throw CustomError.badRequest('Falta el detalle');

            return new RequestFormEntity(id || _id, type, date, details, email, answers);
    }
}