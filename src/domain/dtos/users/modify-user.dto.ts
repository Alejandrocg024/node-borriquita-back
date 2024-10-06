import { regularExps } from '../../../config';

type UserRole = 'ADMIN_ROLE' | 'MAYORDOMIA_ROLE' | 'COMUNICACIONES_ROLE';


export class ModifyUserDto {

  private constructor(
    public readonly id: string,
    public readonly dni?: string,
    public readonly name?: string,
    public readonly lastname?: string,
    public readonly password?: string,
    public readonly birthdate?: Date,
    public readonly email?: string,
    public readonly address?: string,
    public readonly role?: UserRole,
  ) {}

  static create( object: { [key:string]:any } ): [string?, ModifyUserDto?] {
    const { id, dni, name, lastname, password, birthdate, email, address, role } = object;

    if (!id) return ['Falta el id'];

    return [undefined, new ModifyUserDto(id, dni, name, lastname, password, birthdate, email, address, role)];

  }


}