import { AnnouncementModel } from '../../data';
import { RequestFormModel } from '../../data/mongo';
import { UserEntity, CreateAnnouncementDto, CustomError, PaginationDto, AnnouncementEntity, RequestFormEntity } from '../../domain';

export class RequestFormService {
    constructor() { }

    async getRequestForms( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;

        try {
            const [ total, requestForms ] = await Promise.all([
                RequestFormModel.countDocuments(),
                RequestFormModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            return {
                page,
                limit,
                total,

                next: `/api/requestForm?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/requestForm?page=${ ( page - 1 ) }&limit=${ limit }`: null,

                announcements: requestForms.map( requestForm => RequestFormEntity.fromObject(requestForm) ),
            }
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }
    
}