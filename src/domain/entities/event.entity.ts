import { CustomError } from "../errors/custom.error";

export class EventEntity {
    constructor(
        public id: string,
        public title: string,
        public startDate: Date,
        public endDate: Date,
        public allDay: boolean,
        public description?: string,
        public location?: string
    ){}


    static fromObject(obj: { [key:string]: any}): EventEntity {
            const { id, _id, title, startDate, endDate, allDay, description, location } = obj;

            if( !_id && !id ) throw CustomError.badRequest('Falta el ID');

            if( !title ) throw CustomError.badRequest('Falta el título');

            if( !startDate ) throw CustomError.badRequest('Falta la fecha de inicio');

            if( !endDate ) throw CustomError.badRequest('Falta la fecha de fin');

            if (endDate < startDate) throw CustomError.badRequest('La fecha de fin debe ser posterior a la fecha de inicio');

            if ( allDay === undefined ) throw CustomError.badRequest('Falta el campo allDay');

            return new EventEntity(id || _id, title, startDate, endDate, allDay, description, location);        
    }
}