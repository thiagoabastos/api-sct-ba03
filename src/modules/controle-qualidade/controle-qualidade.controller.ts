import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { ControleQualidadeService } from './controle-qualidade.service';
import { CreateControleQualidadeDto } from './dto/create-controle-qualidade.dto';
import { UpdateControleQualidadeDto } from './dto/update-controle-qualidade.dto';

@Controller('controle-qualidade')
export class ControleQualidadeController {
  constructor(
    private readonly controleQualidadeService: ControleQualidadeService,
  ) { }

  @Post()
  @Permissao('controle_qualidade_criar')
  create(@Body() dto: CreateControleQualidadeDto) {
    return this.controleQualidadeService.create(dto);
  }

  @Get()
  @Permissao('controle_qualidade_listar')
  findAll(
    @Query('organizarCarroId') organizarCarroId?: string,
    @Query('motorista') motorista?: string,
    @Query('empresa') empresa?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.controleQualidadeService.findAll({
      organizarCarroId: organizarCarroId ? +organizarCarroId : undefined,
      motorista,
      empresa,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get(':id')
  @Permissao('controle_qualidade_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.controleQualidadeService.findOne(id);
  }

  @Patch(':id')
  @Permissao('controle_qualidade_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateControleQualidadeDto,
  ) {
    return this.controleQualidadeService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('controle_qualidade_excluir')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.controleQualidadeService.remove(id);
  }
}
