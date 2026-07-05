import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNomeArranjoCongregacaoDto {
  @IsInt({ message: 'arranjoCongregacaoId deve ser um número inteiro' })
  arranjoCongregacaoId: number;

  @IsInt({ message: 'pessoaId deve ser um número inteiro' })
  pessoaId: number;

  @IsOptional()
  @IsBoolean({ message: 'menorIdade deve ser boolean' })
  menorIdade?: boolean;

  // ── Dias que participará ──────────────────────────────────────
  @IsOptional()
  @IsBoolean({ message: 'sexta deve ser boolean' })
  sexta?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'sabado deve ser boolean' })
  sabado?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'domingo deve ser boolean' })
  domingo?: boolean;

  // ── Carro (geral e por dia) ───────────────────────────────────
  @IsOptional()
  @IsString({ message: 'carro deve ser string' })
  @MaxLength(2, { message: 'carro deve ter no máximo 2 caracteres' })
  carro?: string;

  @IsOptional()
  @IsString({ message: 'carroSexta deve ser string' })
  @MaxLength(2, { message: 'carroSexta deve ter no máximo 2 caracteres' })
  carroSexta?: string;

  @IsOptional()
  @IsString({ message: 'carroSabado deve ser string' })
  @MaxLength(2, { message: 'carroSabado deve ter no máximo 2 caracteres' })
  carroSabado?: string;

  @IsOptional()
  @IsString({ message: 'carroDomingo deve ser string' })
  @MaxLength(2, { message: 'carroDomingo deve ter no máximo 2 caracteres' })
  carroDomingo?: string;

  // ── Ida (geral e por dia) ─────────────────────────────────────
  @IsOptional()
  @IsBoolean({ message: 'ida deve ser boolean' })
  ida?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'idaSexta deve ser boolean' })
  idaSexta?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'idaSabado deve ser boolean' })
  idaSabado?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'idaDomingo deve ser boolean' })
  idaDomingo?: boolean;

  // ── Volta (geral e por dia) ───────────────────────────────────
  @IsOptional()
  @IsBoolean({ message: 'volta deve ser boolean' })
  volta?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'voltaSexta deve ser boolean' })
  voltaSexta?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'voltaSabado deve ser boolean' })
  voltaSabado?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'voltaDomingo deve ser boolean' })
  voltaDomingo?: boolean;

  // ── Observações (geral e por dia) ────────────────────────────
  @IsOptional()
  @IsString({ message: 'observacao deve ser string' })
  @MaxLength(200, { message: 'observacao deve ter no máximo 200 caracteres' })
  observacao?: string;

  @IsOptional()
  @IsString({ message: 'observacaoSexta deve ser string' })
  @MaxLength(200, { message: 'observacaoSexta deve ter no máximo 200 caracteres' })
  observacaoSexta?: string;

  @IsOptional()
  @IsString({ message: 'observacaoSabado deve ser string' })
  @MaxLength(200, { message: 'observacaoSabado deve ter no máximo 200 caracteres' })
  observacaoSabado?: string;

  @IsOptional()
  @IsString({ message: 'observacaoDomingo deve ser string' })
  @MaxLength(200, { message: 'observacaoDomingo deve ter no máximo 200 caracteres' })
  observacaoDomingo?: string;
}
