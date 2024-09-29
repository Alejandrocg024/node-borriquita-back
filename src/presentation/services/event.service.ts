import { EventModel } from "../../data/mongo";
import { CustomError, PaginationDto, UpdateEventDto, UserEntity } from "../../domain";
import { CreateEventDto } from "../../domain/dtos/events/create-event.dto";
import { EventEntity } from "../../domain/entities/event.entity";

export class EventService {
    constructor() { }

    async getEvents( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;

        try {
            const [ total, events ] = await Promise.all([
                EventModel.countDocuments(),
                EventModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            return {
                page,
                limit,
                total,

                next: `/api/event?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev: (page - 1 > 0) ? `/api/event?page=${ ( page - 1 ) }&limit=${ limit }`: null,

                events: events.map( event => EventEntity.fromObject(event) ),
            }
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async getEvent( id: string ) {
        try {
            const event = await EventModel.findById(id);
            if (!event) throw CustomError.notFound('Evento no encontrado');

            return EventEntity.fromObject(event)
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async createEvent(createEventDto: CreateEventDto) {

        try {
            const event = new EventModel(createEventDto);

            await event.save();

            console.log(event);

            return EventEntity.fromObject(event);
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async updateEvent(updateEventDto: UpdateEventDto) {

        try {
            const updatedEvent = await EventModel.findByIdAndUpdate(
                updateEventDto.id, 
                updateEventDto, 
            {
                new: true,     
                overwrite: true, 
                runValidators: true, 
              });

              if (!updatedEvent) {
                return CustomError.notFound('Noticia no encontrada');
              }

            return EventEntity.fromObject(updatedEvent);
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }

    async deleteEvent( id: string ) {

        try {
            const deletedAnnouncement = await EventModel.findByIdAndDelete(id);
            if (!deletedAnnouncement) throw CustomError.notFound('Noticia no encontrada');

            return;
        } catch ( error ) {
            throw CustomError.internalServer( (error as Error).message );
        }
    }
    
}