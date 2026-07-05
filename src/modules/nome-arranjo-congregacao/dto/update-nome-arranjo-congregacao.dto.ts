import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateNomeArranjoCongregacaoDto } from './create-nome-arranjo-congregacao.dto';

// No update não permite alterar o vínculo com arranjo ou pessoa
export class UpdateNomeArranjoCongregacaoDto extends PartialType(
  OmitType(CreateNomeArranjoCongregacaoDto, [
    'arranjoCongregacaoId',
    'pessoaId',
  ] as const),
) {}
