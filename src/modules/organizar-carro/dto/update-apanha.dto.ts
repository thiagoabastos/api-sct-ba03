import { PartialType } from '@nestjs/mapped-types';
import { CreateApanhaDto } from './create-apanha.dto';

export class UpdateApanhaDto extends PartialType(CreateApanhaDto) {}
