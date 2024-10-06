import { CustomError } from "../errors/custom.error";

export class AnnouncementEntity {
    constructor(
        public id: string,
        public title: string,
        public publicationDate: Date,
        public modificationDate: Date,
        public available: boolean,
        public author: string,
        public body: string,
        public media?: string,
    ){}


    static fromObject(obj: { [key:string]: any}): AnnouncementEntity {
            const { id, _id, title, publicationDate, modificationDate, available, author, body, media } = obj;

            if( !_id && !id ) throw CustomError.badRequest('Falta el ID');

            if( !title ) throw CustomError.badRequest('Falta el título');

            if( !publicationDate ) throw CustomError.badRequest('Falata la fecha de publicación');

            if( !modificationDate ) throw CustomError.badRequest('Falata la fecha de modificación');

            if ( modificationDate < publicationDate ) throw CustomError.badRequest('La fecha de modificación debe ser posterior a la fecha de publicación');

            if( available === undefined ) throw CustomError.badRequest('Falata la disponibilidad');

            if( !author ) throw CustomError.badRequest('Falta el autor');

            if( !body ) throw CustomError.badRequest('Falta el cuerpo');

            return new AnnouncementEntity(id || _id, title, publicationDate, modificationDate, available, author, body, media);
    }
}