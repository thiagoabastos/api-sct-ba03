import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { CongregacaoService } from './congregacao.service';
import { CreateCongregacaoDto } from './dto/create-congregacao.dto';
import { UpdateCongregacaoDto } from './dto/update-congregacao.dto';

@Controller('congregacoes')
export class CongregacaoController {
  constructor(private readonly congregacaoService: CongregacaoService) { }

  @Post()
  @Permissao('congregacao_criar')
  create(@Body() dto: CreateCongregacaoDto) {
    return this.congregacaoService.create(dto);
  }

  @Get()
  @Permissao('congregacao_ver')
  findAll(
    @Query('nome') nome?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.congregacaoService.findAll({
      nome,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('congregacao_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.congregacaoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('congregacao_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCongregacaoDto,
  ) {
    return this.congregacaoService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('congregacao_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.congregacaoService.remove(id);
  }
}
