import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditorioDto } from './create-auditorio.dto';

export class UpdateAuditorioDto extends PartialType(CreateAuditorioDto) {}
