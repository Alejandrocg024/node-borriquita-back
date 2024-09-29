import { AnnouncementModel } from '../../data';
import { UserEntity, CreateAnnouncementDto, CustomError, PaginationDto, AnnouncementEntity } from '../../domain';
import { UpdateAnnouncementDto } from '../../domain/dtos/announcements/update-announcement.dto';

export class AnnouncementService {
    constructor() { }

    async getAnnouncements( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;

        try {
            const [ total, announcement ] = await Promise.all([
                AnnouncementModel.countDocuments(),
                AnnouncementModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('author')
            ]);

            return {
                page,
                limit,
                total,

                next: `/api/announcement?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/announcement?page=${ ( page - 1 ) }&limit=${ limit }`: null,

                announcements: announcement.map( announcement => AnnouncementEntity.fromObject(announcement) ),
            }
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async getAnnouncement( id: string ) {
        try {
            const announcement = await AnnouncementModel.findById(id).populate('author');
            if (!announcement) throw CustomError.notFound('Noticia no encontrada');

            return AnnouncementEntity.fromObject(announcement)
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }
    
    async createAnnouncement(createAnnouncementDto: CreateAnnouncementDto, user: UserEntity) {

        if (!user) throw CustomError.badRequest('Usuario no encontrado');

        try {
            const announcement = new AnnouncementModel({
                ...createAnnouncementDto,
                author: user.id
            });

            await announcement.save();

            return AnnouncementEntity.fromObject(announcement);
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async updateAnnouncement(updateAnnouncementDto: UpdateAnnouncementDto, user: UserEntity) {

        if (!user) throw CustomError.badRequest('Usuario no encontrado');

        try {
            const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
                updateAnnouncementDto.id, 
                updateAnnouncementDto, 
            {
                new: true,        // Devuelve el documento actualizado
                overwrite: true,  // Reemplaza completamente el documento
                runValidators: true,  // Ejecuta las validaciones del esquema
              });

              if (!updatedAnnouncement) {
                return CustomError.notFound('Noticia no encontrada');
              }

            return AnnouncementEntity.fromObject(updatedAnnouncement);
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async deleteAnnouncement( id: string ) {

        try {
            const deletedAnnouncement = await AnnouncementModel.findByIdAndDelete(id);
            if (!deletedAnnouncement) throw CustomError.notFound('Noticia no encontrada');

            return;
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }
    
}