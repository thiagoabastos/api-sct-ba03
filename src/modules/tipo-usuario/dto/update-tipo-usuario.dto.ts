import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoUsuarioDto } from './create-tipo-usuario.dto';

export class UpdateTipoUsuarioDto extends PartialType(CreateTipoUsuarioDto) {}
