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
import { ApanhaService } from './apanha.service';
import { CreateApanhaDto } from './dto/create-apanha.dto';
import { UpdateApanhaDto } from './dto/update-apanha.dto';

@Controller('apanhas')
export class ApanhaController {
  constructor(private readonly apanhaService: ApanhaService) { }

  @Post()
  @Permissao('apanha_criar')
  create(@Body() dto: CreateApanhaDto) {
    return this.apanhaService.create(dto);
  }

  @Get()
  @Permissao('apanha_listar')
  findAll(
    @Query('local') local?: string,
    @Query('congregacaoId') congregacaoId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.apanhaService.findAll({
      local,
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('congregacao/:congregacaoId')
  @Permissao('apanha_listar')
  findByCongregacao(
    @Param('congregacaoId', ParseIntPipe) congregacaoId: number,
  ) {
    return this.apanhaService.findByCongregacao(congregacaoId);
  }

  @Get(':id')
  @Permissao('apanha_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.apanhaService.findOne(id);
  }

  @Patch(':id')
  @Permissao('apanha_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApanhaDto,
  ) {
    return this.apanhaService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('apanha_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.apanhaService.remove(id);
  }
}
