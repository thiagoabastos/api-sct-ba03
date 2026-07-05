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
import { OrganizarCarroService } from './organizar-carro.service';
import { ApanhaService } from './apanha.service';
import { CreateOrganizarCarroDto } from './dto/create-organizar-carro.dto';
import { UpdateOrganizarCarroDto } from './dto/update-organizar-carro.dto';
import { CreateApanhaDto } from './dto/create-apanha.dto';
import { UpdateApanhaDto } from './dto/update-apanha.dto';

// ─────────────────────────────────────────
// ORGANIZAR CARRO
// ─────────────────────────────────────────
@Controller('organizar-carros')
export class OrganizarCarroController {
  constructor(
    private readonly organizarCarroService: OrganizarCarroService,
    private readonly apanhaService: ApanhaService,
  ) {}

  // ── Organizar Carro ───────────────────────────────────────────

  @Post()
  @Permissao('organizar_carro_criar')
  create(@Body() dto: CreateOrganizarCarroDto) {
    return this.organizarCarroService.create(dto);
  }

  @Get()
  @Permissao('organizar_carro_ver')
  findAll(
    @Query('eventoId') eventoId?: string,
    @Query('congregacaoId') congregacaoId?: string,
    @Query('capitaoId') capitaoId?: string,
    @Query('dia') dia?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.organizarCarroService.findAll({
      eventoId: eventoId ? Number(eventoId) : undefined,
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      capitaoId: capitaoId ? Number(capitaoId) : undefined,
      dia,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // Retorna todos os carros de um evento agrupados por dia
  @Get('evento/:eventoId')
  @Permissao('organizar_carro_ver')
  findByEvento(@Param('eventoId', ParseIntPipe) eventoId: number) {
    return this.organizarCarroService.findByEvento(eventoId);
  }

  @Get(':id')
  @Permissao('organizar_carro_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizarCarroService.findOne(id);
  }

  @Patch(':id')
  @Permissao('organizar_carro_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizarCarroDto,
  ) {
    return this.organizarCarroService.update(id, dto);
  }

  // Gerenciar pontos de apanha individualmente
  @Post(':id/apanhas/:apanhaId')
  @Permissao('organizar_carro_editar')
  @HttpCode(HttpStatus.CREATED)
  adicionarApanha(
    @Param('id', ParseIntPipe) id: number,
    @Param('apanhaId', ParseIntPipe) apanhaId: number,
  ) {
    return this.organizarCarroService.adicionarApanha(id, apanhaId);
  }

  @Delete(':id/apanhas/:apanhaId')
  @Permissao('organizar_carro_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  removerApanha(
    @Param('id', ParseIntPipe) id: number,
    @Param('apanhaId', ParseIntPipe) apanhaId: number,
  ) {
    return this.organizarCarroService.removerApanha(id, apanhaId);
  }

  @Delete(':id')
  @Permissao('organizar_carro_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizarCarroService.remove(id);
  }

  // ── Apanha ────────────────────────────────────────────────────

  @Post('apanhas')
  @Permissao('organizar_carro_criar')
  createApanha(@Body() dto: CreateApanhaDto) {
    return this.apanhaService.create(dto);
  }

  @Get('apanhas')
  @Permissao('organizar_carro_ver')
  findAllApanhas(
    @Query('congregacaoId') congregacaoId?: string,
    @Query('local') local?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.apanhaService.findAll({
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      local,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('apanhas/congregacao/:congregacaoId')
  @Permissao('organizar_carro_ver')
  findApanhasByCongregacao(
    @Param('congregacaoId', ParseIntPipe) congregacaoId: number,
  ) {
    return this.apanhaService.findByCongregacao(congregacaoId);
  }

  @Get('apanhas/:id')
  @Permissao('organizar_carro_ver')
  findOneApanha(@Param('id', ParseIntPipe) id: number) {
    return this.apanhaService.findOne(id);
  }

  @Patch('apanhas/:id')
  @Permissao('organizar_carro_editar')
  updateApanha(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApanhaDto,
  ) {
    return this.apanhaService.update(id, dto);
  }

  @Delete('apanhas/:id')
  @Permissao('organizar_carro_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeApanha(@Param('id', ParseIntPipe) id: number) {
    return this.apanhaService.remove(id);
  }
}
