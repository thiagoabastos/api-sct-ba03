import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoTipoDto } from './create-evento-tipo.dto';

export class UpdateEventoTipoDto extends PartialType(CreateEventoTipoDto) {}
