import { regularExps } from '../../../config';




export class ModifyUserDto {

  private constructor(
    public dni: string,
    public name?: string,
    public lastname?: string,
    public password?: string,
    public birthDate?: Date,
    public email?: string,
    public admissionDate?: Date,
    public outDate?: Date,
    public address?: string,
    public role?: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, ModifyUserDto?] {
    const { dni, name, lastname, password, birthDate, email, admissionDate, outDate, address, role } = object;

    if ( !dni ) return ['Missing dni'];
    if ( !regularExps.dni.test( dni ) ) return ['DNI is not valid'];

    return [undefined, new ModifyUserDto(dni, name, lastname, password, birthDate, email, admissionDate, outDate, address, role)];

  }


}