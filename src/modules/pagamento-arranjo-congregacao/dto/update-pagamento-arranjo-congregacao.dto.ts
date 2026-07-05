import { PartialType } from '@nestjs/mapped-types';
import { CreatePagamentoArranjoCongregacaoDto } from './create-pagamento-arranjo-congregacao.dto';

export class UpdatePagamentoArranjoCongregacaoDto extends PartialType(CreatePagamentoArranjoCongregacaoDto) {}
