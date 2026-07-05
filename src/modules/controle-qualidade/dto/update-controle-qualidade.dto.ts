import { PartialType } from '@nestjs/mapped-types';
import { CreateControleQualidadeDto } from './create-controle-qualidade.dto';

export class UpdateControleQualidadeDto extends PartialType(CreateControleQualidadeDto) { }
