import { CustomError } from '../errors/custom.error';

export class UserEntity {
    constructor(
        public id: string,
        public dni: string,
        public name: string,
        public lastname: string,
        public password: string,
        public birthDate: Date,
        public email: string,
        public emailValidated: boolean,
        public admissionDate: Date,
        public outDate?: Date,
        public address?: string,
        public role?: string,
    ){}


    static fromObject(obj: { [key:string]: any}): UserEntity {
            const { id, _id, dni, name, lastname, password, birthDate, email, emailValidated, admissionDate, outDate, address, role } = obj;

            
            if( !_id && !id ) throw CustomError.badRequest('Falta el ID');

            if( !dni ) throw CustomError.badRequest('Falta el DNI');

            if( !name ) throw CustomError.badRequest('Falta el nombre');

            if( !lastname ) throw CustomError.badRequest('Falta el apellido');

            if( !password ) throw CustomError.badRequest('Falta la contraseña');

            if( !birthDate ) throw CustomError.badRequest('Falta la fecha de nacimiento');

            if( !email ) throw CustomError.badRequest('Falta el email');

            if( emailValidated === undefined ) throw CustomError.badRequest('Falta la validación del email');

            if( !admissionDate ) throw CustomError.badRequest('Falta la fecha de admisión');

            return new UserEntity(id || _id, dni, name, lastname, password, birthDate, email, emailValidated, admissionDate, outDate, address, role);
    }
}