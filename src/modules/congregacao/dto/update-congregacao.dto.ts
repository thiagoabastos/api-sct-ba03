import { PartialType } from '@nestjs/mapped-types';
import { CreateCongregacaoDto } from './create-congregacao.dto';

export class UpdateCongregacaoDto extends PartialType(CreateCongregacaoDto) { }
