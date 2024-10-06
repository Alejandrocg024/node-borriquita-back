export class CreateAnswerFormDto {

    private constructor(
        public readonly requestId: string,
        public readonly user: string,
        public readonly date: Date,
        public readonly details: string,
    ) {}


    static create( object: { [key:string]:any } ): [string?, CreateAnswerFormDto?] {
        let { requestId, user, date, details } = object;

        if ( !requestId ) return ['Falta el id de la solicitud'];

        if ( !user ) return ['Falta el usuario'];

        if ( !date ) return ['Falta la fecha'];

        if ( !details ) return ['Falta el detalle'];
        

        return [undefined, new CreateAnswerFormDto( requestId, user, date, details )];

    }
}