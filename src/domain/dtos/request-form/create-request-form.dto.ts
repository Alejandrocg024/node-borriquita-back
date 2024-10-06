export type Type = ['BAJA', 'ASIGNACIÓN', 'CONSULTA', 'OTROS'];

export class CreateRequestFormDto {
    private constructor(
        public readonly type: Type,
        public readonly date: Date,
        public readonly details: string,
        public readonly user?: string,
        public readonly email?: string,
    ) {}


    static create( object: { [key:string]:any } ): [string?, CreateRequestFormDto?] {
        let { type, date, details, user, email } = object;

        if ( !type ) return ['Falta el tipo'];

        if ( !date ) return ['Falta la fecha'];

        if ( !details ) return ['Falta el detalle'];
        
        return [undefined, new CreateRequestFormDto( type, date, details, user, email)];

    }
}