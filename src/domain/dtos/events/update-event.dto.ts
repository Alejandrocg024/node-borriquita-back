import { start } from "repl";
import { regularExps } from "../../../config";


export class UpdateEventDto {

    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly allDay: boolean,
        public readonly description: string,
        public readonly location?: string
    ) { }


    static create(object: { [key: string]: any }): [string?, UpdateEventDto?] {
        let { id, title, startDate, endDate, allDay, description, location } = object;

        if ( !id) return ['Falta el id'];

        if (!title) return ['Falta el título'];

        if (!startDate) return ['Falta la fecha de inicio'];
        if (!endDate) return ['Falata la fecha de fin'];
        if (endDate < startDate) return ['La fecha de fin debe ser posterior a la fecha de inicio'];

        if (!description) return ['Falta la descripción'];

        if (allDay === undefined) return ['Falta el campo ¿todo el día?'];

        return [undefined, new UpdateEventDto(id, title, startDate, endDate, allDay, description, location)];

    }
}