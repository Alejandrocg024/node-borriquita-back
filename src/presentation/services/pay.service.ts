import { AnnouncementModel } from '../../data';
import { PaysModel } from '../../data/mongo';
import { UserEntity, CreateAnnouncementDto, CustomError, PaginationDto, AnnouncementEntity, PayEntity } from '../../domain';

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
}