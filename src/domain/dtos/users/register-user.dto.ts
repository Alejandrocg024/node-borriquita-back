import { regularExps } from '../../../config';


type UserRole = 'ADMIN_ROLE' | 'MAYORDOMIA_ROLE' | 'COMUNICACIONES_ROLE';

export class RegisterUserDto {

  private constructor(
    public readonly dni: string,
    public readonly name: string,
    public readonly lastname: string,
    public readonly password: string,
    public readonly birthDate: Date,
    public readonly email: string,
    public readonly emailValidated: boolean,
    public readonly admissionDate: Date,
    public readonly address?: string,
    public readonly role?: UserRole,
  ) {}

  static create( object: { [key:string]:any } ): [string?, RegisterUserDto?] {
    const { dni, name, lastname, password, birthDate, email, admissionDate,address, role } = object;

    if ( !dni ) return ['Falta el DNI'];
    if ( !regularExps.dni.test( dni ) ) return ['DNI no válido'];

    if ( !name ) return ['Falta el nombre'];

    if ( !lastname ) return ['Falta el apellido'];

    if ( !password ) return ['Falta la contraseña'];

    if ( !birthDate ) return ['Falta la fecha de nacimiento'];

    if ( !email ) return ['Falta el email'];

    return [undefined, new RegisterUserDto(dni, name, lastname, password, birthDate, email, false, new Date(), address, role)];

  }


}