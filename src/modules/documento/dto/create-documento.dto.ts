import { IsNotEmpty, IsString, MaxLength, IsUrl } from 'class-validator';

export class CreateDocumentoDto {
  @IsNotEmpty({ message: 'O nome do documento é obrigatório' })
  @IsString({ message: 'O nome do documento deve ser um texto' })
  @MaxLength(50, { message: 'O nome do documento não pode ultrapassar 50 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'A URL do documento é obrigatória' })
  @IsString({ message: 'A URL deve ser um texto' })
  @MaxLength(500, { message: 'A URL não pode ultrapassar 500 caracteres' })
  @IsUrl({}, { message: 'A URL fornecida não é válida' })
  url: string;
}
