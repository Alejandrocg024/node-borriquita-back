import { regularExps } from '../../../config';




export class LoginUserDto {

  private constructor(
    public dni: string,
    public password: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, LoginUserDto?] {
    const { dni, password } = object;

    if ( !dni ) return ['Missing DNI'];
    if ( !regularExps.dni.test(dni) ) return ['Invalid DNI'];
    if ( !password ) return ['Missing password'];

    return [undefined, new LoginUserDto(dni, password)];

  }


}