
export class UpdateAnnouncementDto {

    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly publicationDate: Date,
        public readonly modificationDate: Date,
        public readonly available: boolean,
        public readonly body: string,
        public readonly media?: string
    ) {}


    static create( object: { [key:string]:any } ): [string?, UpdateAnnouncementDto?] {
        let { id, title, available, body, media } = object;

        if ( !id) return ['Falta el id'];
        if ( !title ) return ['Falta el título'];
        if( available === undefined ) return['Se debe indicar si está disponible'];
        if ( !body ) return ['Falta el cuerpo'];

        return [undefined, new UpdateAnnouncementDto(id, title, new Date(), new Date(), available ,body, media)];

    }
}