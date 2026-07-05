import { PartialType } from '@nestjs/mapped-types';
import { CreateArranjoCongregacaoDto } from './create-arranjo-congregacao.dto';

export class UpdateArranjoCongregacaoDto extends PartialType(CreateArranjoCongregacaoDto) {}
