
type PayState = 'PENDING' | 'PAID' | 'CANCELLED';
type PayMethod = 'CASH' | 'CARD';

export class UpdatePayDto {

    private constructor(
        public id: string,
        public user: string,
        public concept: string,
        public quantity: number,
        public startDate: Date,
        public finishDate: Date,
        public state: PayState,
        public payMethod?: PayMethod,
    ) {}


    static create( object: { [key:string]:any } ): [string?, UpdatePayDto?] {
        let { id, user, concept, quantity, startDate, finishDate, state, payMethod} = object;

        if ( !id ) return ['Falta el ID'];

        if ( !user ) return ['Falta el usuario'];

        if ( !concept ) return ['Falta el concepto'];

        if ( !quantity ) return ['Falta la cantidad'];

        if ( quantity < 0 ) return ['La cantidad no puede ser negativa'];

        if ( !startDate ) return ['Falta la fecha de pago'];

        if ( !finishDate ) return ['Falta la fecha de finalizacion del pago'];

        if ( startDate > finishDate ) return ['La fecha de inicio no puede ser posterior a la fecha de finalizacion'];

        if ( !state ) return ['Falta el estado'];

        return [undefined, new UpdatePayDto( id, user, concept, quantity, startDate, finishDate, state, payMethod)];

    }
}