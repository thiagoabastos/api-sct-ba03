import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  AvaliacaoMotorista,
  AvaliacaoVeiculo,
  SimNao,
} from '@prisma/client';

export class CreateControleQualidadeDto {
  @IsNotEmpty({ message: 'organizarCarroId é obrigatório' })
  @IsInt({ message: 'organizarCarroId deve ser um número inteiro' })
  organizarCarroId: number;

  @IsOptional()
  @IsString({ message: 'Empresa deve ser uma string' })
  @MaxLength(20, { message: 'Empresa deve ter no máximo 20 caracteres' })
  empresa?: string;

  @IsOptional()
  @IsString({ message: 'Placa deve ser uma string' })
  @MaxLength(10, { message: 'Placa deve ter no máximo 10 caracteres' })
  placa?: string;

  @IsOptional()
  @IsString({ message: 'Número do ônibus deve ser uma string' })
  @MaxLength(10, { message: 'Número do ônibus deve ter no máximo 10 caracteres' })
  numeroOnibus?: string;

  @IsOptional()
  @IsString({ message: 'Motorista deve ser uma string' })
  @MaxLength(50, { message: 'Motorista deve ter no máximo 50 caracteres' })
  motorista?: string;

  @IsOptional()
  @IsString({ message: 'Telefone do motorista deve ser uma string' })
  @MaxLength(20, { message: 'Telefone do motorista deve ter no máximo 20 caracteres' })
  telefoneMotorista?: string;

  @IsOptional()
  @IsEnum(AvaliacaoMotorista, { message: 'Aparência do motorista inválida' })
  aparenciaMotorista?: AvaliacaoMotorista;

  @IsNotEmpty({ message: 'Educação do motorista é obrigatória' })
  @IsEnum(AvaliacaoMotorista, { message: 'Educação do motorista inválida' })
  educacao: AvaliacaoMotorista;

  @IsOptional()
  @IsEnum(AvaliacaoVeiculo, { message: 'Condição dos pneus inválida' })
  condicaoPneus?: AvaliacaoVeiculo;

  @IsOptional()
  @IsEnum(AvaliacaoVeiculo, { message: 'Limpeza do carro inválida' })
  limpezaCarro?: AvaliacaoVeiculo;

  @IsOptional()
  @IsEnum(SimNao, { message: 'Opção de extintor de incêndio inválida' })
  extintorIncendioDisponivel?: SimNao;

  @IsOptional()
  @IsEnum(SimNao, { message: 'Opção de problemas com horário inválida' })
  problemasQuantoHorario?: SimNao;

  @IsOptional()
  @IsEnum(SimNao, { message: 'Opção de problemas de embarque inválida' })
  pontosEmbarqueProblemas?: SimNao;

  @IsOptional()
  @IsEnum(SimNao, { message: 'Opção de tráfego no acostamento inválida' })
  trafegouAcostamento?: SimNao;

  @IsOptional()
  @IsEnum(SimNao, { message: 'Opção de velocidade inválida' })
  velocidadeTrafegou?: SimNao;

  @IsOptional()
  @IsString({ message: 'Informações adicionais devem ser uma string' })
  @MaxLength(200, { message: 'Informações adicionais devem ter no máximo 200 caracteres' })
  informacoesAdicionaisSugestoes?: string;
}
