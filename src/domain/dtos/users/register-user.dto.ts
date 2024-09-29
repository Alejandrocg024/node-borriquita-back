import { regularExps } from '../../../config';




export class RegisterUserDto {

  private constructor(
    public dni: string,
    public name: string,
    public lastname: string,
    public password: string,
    public birthDate: Date,
    public email: string,
    public admissionDate?: Date,
    public address?: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, RegisterUserDto?] {
    const { dni, name, lastname, password, birthDate, email, admissionDate, address } = object;

    if ( !dni ) return ['Missing dni'];
    if ( !regularExps.dni.test( dni ) ) return ['DNI is not valid'];
    if ( !name ) return ['Missing name'];
    if ( !lastname ) return ['Missing lastname'];
    if ( !password ) return ['Missing password'];
    if ( password.length < 6 ) return ['Password too short'];
    if ( !birthDate ) return ['Missing birthDate'];
    if ( !regularExps.fecha.test( birthDate ) ) return ['BirthDate is not valid'];
    if ( !email ) return ['Missing email'];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid'];

    return [undefined, new RegisterUserDto(dni, name, lastname, password, birthDate, email, admissionDate, address)];

  }


}