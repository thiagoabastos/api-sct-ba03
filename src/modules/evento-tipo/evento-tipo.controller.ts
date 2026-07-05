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
import { EventoTipoService } from './evento-tipo.service';
import { CreateEventoTipoDto } from './dto/create-evento-tipo.dto';
import { UpdateEventoTipoDto } from './dto/update-evento-tipo.dto';

@Controller('eventos-tipos')
export class EventoTipoController {
  constructor(private readonly eventoTipoService: EventoTipoService) { }

  @Post()
  @Permissao('evento_tipo_criar')
  create(@Body() dto: CreateEventoTipoDto) {
    return this.eventoTipoService.create(dto);
  }

  @Get()
  @Permissao('evento_tipo_ver')
  findAll(
    @Query('nome') nome?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventoTipoService.findAll({
      nome,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('evento_tipo_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventoTipoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('evento_tipo_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoTipoDto,
  ) {
    return this.eventoTipoService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('evento_tipo_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventoTipoService.remove(id);
  }
}
