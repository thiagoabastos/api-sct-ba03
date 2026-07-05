import {
  IsDecimal,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNotEmpty
} from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(30, { message: 'Nome deve ter no máximo 30 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString({ message: 'Telefone deve ser uma string' })
  @MinLength(8, { message: 'Telefone deve ter no mínimo 8 caracteres' })
  @MaxLength(15, { message: 'Telefone deve ter no máximo 15 caracteres' })
  @Matches(/^[\d\s()\-+]+$/, { message: 'Telefone inválido' })
  telefone: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email?: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '1,2', force_decimal: false },
    { message: 'Valor do ônibus deve ser um decimal válido (ex: 150.00)' },
  )
  valorOnibus?: number;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '1,2', force_decimal: false },
    { message: 'Valor da passagem deve ser um decimal válido (ex: 25.50)' },
  )
  valorPassagem?: number;

  @IsOptional()
  @IsString({ message: 'Transferência bancária deve ser uma string' })
  @MaxLength(500, {
    message: 'Transferência bancária deve ter no máximo 500 caracteres',
  })
  transferenciaBancaria?: string;
}
