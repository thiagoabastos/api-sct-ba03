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
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  @Permissao('evento_criar')
  create(@Body() dto: CreateEventoDto) {
    return this.eventoService.create(dto);
  }

  @Get()
  @Permissao('evento_ver')
  findAll(
    @Query('ano') ano?: string,
    @Query('eventoTipoId') eventoTipoId?: string,
    @Query('auditorioId') auditorioId?: string,
    @Query('congregacaoId') congregacaoId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventoService.findAll({
      ano,
      eventoTipoId: eventoTipoId ? Number(eventoTipoId) : undefined,
      auditorioId: auditorioId ? Number(auditorioId) : undefined,
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('evento_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('evento_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoDto,
  ) {
    return this.eventoService.update(id, dto);
  }

  @Post(':id/congregacoes/:congregacaoId')
  @Permissao('evento_editar')
  @HttpCode(HttpStatus.CREATED)
  adicionarCongregacao(
    @Param('id', ParseIntPipe) id: number,
    @Param('congregacaoId', ParseIntPipe) congregacaoId: number,
  ) {
    return this.eventoService.adicionarCongregacao(id, congregacaoId);
  }

  @Delete(':id/congregacoes/:congregacaoId')
  @Permissao('evento_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  removerCongregacao(
    @Param('id', ParseIntPipe) id: number,
    @Param('congregacaoId', ParseIntPipe) congregacaoId: number,
  ) {
    return this.eventoService.removerCongregacao(id, congregacaoId);
  }

  @Delete(':id')
  @Permissao('evento_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventoService.remove(id);
  }
}
