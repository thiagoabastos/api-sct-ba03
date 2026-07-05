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
import { TipoUsuarioService } from './tipo-usuario.service';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';

@Controller('tipos-usuarios')
export class TipoUsuarioController {
  constructor(private readonly tipoUsuarioService: TipoUsuarioService) { }

  @Post()
  @Permissao('tipo_usuario_criar')
  create(@Body() dto: CreateTipoUsuarioDto) {
    return this.tipoUsuarioService.create(dto);
  }

  @Get()
  @Permissao('tipo_usuario_ver')
  findAll(
    @Query('nome') nome?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tipoUsuarioService.findAll({
      nome,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('tipo_usuario_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoUsuarioService.findOne(id);
  }

  @Patch(':id')
  @Permissao('tipo_usuario_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoUsuarioDto,
  ) {
    return this.tipoUsuarioService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('tipo_usuario_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoUsuarioService.remove(id);
  }
}
