import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizarCarroDto } from './create-organizar-carro.dto';

export class UpdateOrganizarCarroDto extends PartialType(CreateOrganizarCarroDto) {}
