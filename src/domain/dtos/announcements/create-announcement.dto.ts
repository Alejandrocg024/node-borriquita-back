import { regularExps } from "../../../config";


export class CreateAnnouncementDto {

    private constructor(
        public readonly title: string,
        public readonly publicationDate: Date,
        public readonly modificationDate: Date,
        public readonly available: boolean,
        public readonly body: string,
        public readonly media?: string
    ) {}


    static create( object: { [key:string]:any } ): [string?, CreateAnnouncementDto?] {
        let { title, available, body, media } = object;

        if ( !title ) return ['Missing title'];
        // if(publicationDate < Date.now()- 60000) return ['La fecha de publicación debe ser en el futuro'];
        // if(modificationDate < Date.now()- 60000) return ['La fecha de modificación debe ser en el futuro'];
        // if(modificationDate < publicationDate) return ['La fecha de modificación debe ser posterior a la fecha de publicación'];
        // if(!regularExps.fecha.test(publicationDate)) return ['La fecha de publicación no es válida'];
        // if(!regularExps.fecha.test(modificationDate)) return ['La fecha de modificación no es válida'];
        if( available === undefined ) return['Se debe indicar si está disponible'];
        if ( !body ) return ['Falta el cuerpo'];

        // let [dia, mes, anio] = publicationDate.split('/');
        // publicationDate = new Date(+anio, (+mes) - 1, +dia);

        // [dia, mes, anio] = modificationDate.split('/');
        // modificationDate = new Date(+anio, (+mes) - 1, +dia);

        return [undefined, new CreateAnnouncementDto(title, new Date(), new Date(), available ,body, media)];

    }
}