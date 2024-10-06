import { regularExps } from "../../../config";


export class CreateAnnouncementDto {

    private constructor(
        public readonly title: string,
        public readonly publicationDate: Date,
        public readonly modificationDate: Date,
        public readonly available: boolean,
        public readonly body: string,
        public readonly media?: string,
    ) {}


    static create( object: { [key:string]:any } ): [string?, CreateAnnouncementDto?] {
        let { title, available, body, media } = object;

        if ( !title ) return ['Falta el título'];

        if( available === undefined ) return['Se debe indicar si está disponible'];

        if ( !body ) return ['Falta el cuerpo'];

        return [undefined, new CreateAnnouncementDto(title, new Date(), new Date(), available ,body, media)];

    }
}