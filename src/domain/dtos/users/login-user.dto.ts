import { regularExps } from '../../../config';




export class LoginUserDto {

  private constructor(
    public readonly dni: string,
    public readonly password: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, LoginUserDto?] {
    const { dni, password } = object;

    if ( !dni ) return ['Falta el DNI'];
    if ( !regularExps.dni.test( dni ) ) return ['DNI no válido'];

    if ( !password ) return ['Falta la contraseña'];

    return [undefined, new LoginUserDto(dni, password)];

  }


}