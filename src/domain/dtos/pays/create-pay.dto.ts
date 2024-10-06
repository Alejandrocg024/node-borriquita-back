type PayState = 'PENDING' | 'PAID' | 'CANCELLED';
type PayMethod = 'CASH' | 'CARD';


export class CreatePayDto {

    private constructor(
        public readonly concept: string,
        public readonly quantity: number,
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly state: PayState,
        public readonly user?: string,
        public readonly payMethod?: PayMethod,
    ) {}


    static create( object: { [key:string]:any } ): [string?, CreatePayDto?] {
        let { concept, quantity, startDate, finishDate, state, userPayer, payMethod} = object;

        if ( !concept ) return ['Falta el concepto'];

        if ( !quantity ) return ['Falta la cantidad'];

        if ( quantity < 0 ) return ['La cantidad no puede ser negativa'];

        if ( !startDate ) return ['Falta la fecha de pago'];

        if ( !finishDate ) return ['Falta la fecha de finalizacion del pago'];

        if ( startDate > finishDate ) return ['La fecha de inicio no puede ser posterior a la fecha de finalizacion'];

        if ( !state ) return ['Falta el estado'];

    

        return [undefined, new CreatePayDto( concept, quantity, startDate, finishDate, state, userPayer, payMethod)];

    }
}