import { envs, JwtAdapter } from '../../config';
import { PaysModel, UserModel } from '../../data';
import { CreatePayDto, CustomError, PaginationDto, PayEntity, UpdatePayDto, UserEntity } from '../../domain';
const stripe = require('stripe')(envs.STRIPE_API_KEY);

export class PayService {
    constructor() { }

    async getPays( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;

        try {
            const [ total, pays ] = await Promise.all([
                PaysModel.countDocuments(),
                PaysModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            return {
                page,
                limit,
                total,

                next: `/api/pay?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/pay?page=${ ( page - 1 ) }&limit=${ limit }`: null,

                pays: pays.map( pay => PayEntity.fromObject(pay) ),
            }
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async getPay( id: string ) {
        try {
            const pay = await PaysModel.findById(id).populate('user');
            if (!pay) throw CustomError.notFound('Pago no encontrado');

            return PayEntity.fromObject(pay)
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }
    
    async createPay(createPayDto: CreatePayDto) {

        try {
            if(createPayDto.user){
                const pay = new PaysModel({
                    ...createPayDto
                });
    
                await pay.save();
    
                return PayEntity.fromObject(pay);
            } else {
                const users = await UserModel.find();
                for (const user of users) {
                    const pay = new PaysModel({
                        ...createPayDto,
                        user: user.id
                    });
        
                    await pay.save();
                }
            }



        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async checkout(updatePayDto: UpdatePayDto, user: UserEntity) {

        console.log('updatePayDto');
        if (!user) throw CustomError.badRequest('Usuario no encontrado');

        try {
            const { id, concept, quantity } = updatePayDto;
            const { email } = user;

            const token = await JwtAdapter.generateToken({ id }, '10m');
            if (!token) throw CustomError.internalServer('Error generando token');

            const item = {
                price_data: {
                  currency: 'eur',
                  product_data: {
                    name: concept,
                  },
                  unit_amount: quantity * 100,
                },
                quantity: 1, 
            };
            
            const session = await stripe.checkout.sessions.create({
                line_items: [item],
                mode: 'payment',
                success_url: `${envs.FRONTEND_URL}/hermanos/aceptar/${token}`,
                cancel_url: `${envs.FRONTEND_URL}/hermanos`,
                customer_email: email,
            });
            
            return session;
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async cardPay(token: string, user: UserEntity) {

        if (!user) throw CustomError.badRequest('Usuario no encontrado');

        console.log('token', token);

        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unauthorized('Token inválido');

        const { id } = payload as { id: string };
        if (!id) throw CustomError.internalServer('Falta el id en el token');

        const pay = await this.getPay(id);
        if (!pay) throw CustomError.notFound('Pago no encontrado');

        pay.state = 'PAID';
        pay.finishDate = new Date();
        pay.payMethod = 'CARD';

        try {
            const updatedPay = await PaysModel.findByIdAndUpdate(
                pay.id, 
                pay, 
            {
                new: true, 
                overwrite: true,
                runValidators: true, 
              });

              if (!updatedPay) {
                return CustomError.notFound('Pago no encontrado');
              }

            return PayEntity.fromObject(updatedPay);
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async updatePay(updatePayDto: UpdatePayDto, user: UserEntity) {

        if (!user) throw CustomError.badRequest('Usuario no encontrado');


        try {

            const updatedPay = await PaysModel.findByIdAndUpdate(
                updatePayDto.id, 
                updatePayDto, 
            {
                new: true, 
                overwrite: true,
                runValidators: true, 
              });

              if (!updatedPay) {
                return CustomError.notFound('Pago no encontrado');
              }

            return PayEntity.fromObject(updatedPay);
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async deletePay( id: string ) {

        try {
            const deletedPay = await PaysModel.findByIdAndUpdate(id, { state: 'CANCELLED' });
            if (!deletedPay) throw CustomError.notFound('Pago no encontrado');

            return;
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }
}