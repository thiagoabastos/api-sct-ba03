import { IsDecimal, IsInt } from 'class-validator';

export class CreatePagamentoArranjoCongregacaoDto {
  @IsInt({ message: 'arranjoCongregacaoId deve ser um número inteiro' })
  arranjoCongregacaoId: number;

  @IsDecimal(
    { decimal_digits: '1,2', force_decimal: false },
    { message: 'Valor deve ser um decimal válido (ex: 150.00)' },
  )
  valor: number;

  @IsInt({ message: 'formaPagamentoId deve ser um número inteiro' })
  formaPagamentoId: number;
}
