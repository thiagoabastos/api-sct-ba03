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
  Request,
  UseGuards,
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { UsuarioLogado } from './interfaces/usuario-filtros.interface';
import { HierarquiaUsuarioGuard } from './guards/hierarquia-usuario.guard';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';

interface RequestComUsuario extends Request {
  user: UsuarioLogado;
}

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  // Qualquer um autenticado com permissão de criar
  // + HierarquiaUsuarioGuard valida o tipo que pode criar
  @Post()
  @Permissao('usuario_criar')
  @UseGuards(HierarquiaUsuarioGuard)
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  @Get()
  @Permissao('usuario_ver')
  findAll(
    @Query('nome') nome?: string,
    @Query('email') email?: string,
    @Query('congregacaoId') congregacaoId?: string,
    @Query('tipoUsuarioId') tipoUsuarioId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usuarioService.findAll({
      nome,
      email,
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      tipoUsuarioId: tipoUsuarioId ? Number(tipoUsuarioId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // Rota para o usuário logado ver o próprio perfil
  @Get('perfil')
  @Permissao('usuario_ver')
  findPerfil(@Request() req: RequestComUsuario) {
    return this.usuarioService.findPerfil(req.user);
  }

  @Get(':id')
  @Permissao('usuario_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @Permissao('usuario_editar')
  @UseGuards(HierarquiaUsuarioGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, dto);
  }

  // Rota separada para troca de senha — qualquer usuário logado pode alterar a própria
  @Patch(':id/senha')
  @Permissao('usuario_editar')
  updateSenha(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSenhaDto,
  ) {
    return this.usuarioService.updateSenha(id, dto);
  }

  @Delete(':id')
  @Permissao('usuario_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.remove(id);
  }
}
