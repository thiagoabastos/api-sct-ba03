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
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { ArranjoCongregacaoService } from './arranjo-congregacao.service';
import { CreateArranjoCongregacaoDto } from './dto/create-arranjo-congregacao.dto';
import { UpdateArranjoCongregacaoDto } from './dto/update-arranjo-congregacao.dto';
import { UsuarioLogado } from './interfaces/usuario-logado.interface';

interface RequestComUsuario extends Request {
  user: UsuarioLogado;
}

@Controller('arranjos')
export class ArranjoCongregacaoController {
  constructor(
    private readonly arranjoService: ArranjoCongregacaoService,
  ) {}

  @Post()
  @Permissao('arranjo_criar')
  create(
    @Body() dto: CreateArranjoCongregacaoDto,
    @Request() req: RequestComUsuario,
  ) {
    return this.arranjoService.create(dto, req.user);
  }

  @Get()
  @Permissao('arranjo_ver')
  findAll(
    @Query('eventoId') eventoId?: string,
    @Query('congregacaoId') congregacaoId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.arranjoService.findAll({
      eventoId: eventoId ? Number(eventoId) : undefined,
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      status: status as any,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('arranjo_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.arranjoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('arranjo_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArranjoCongregacaoDto,
    @Request() req: RequestComUsuario,
  ) {
    return this.arranjoService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Permissao('arranjo_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.arranjoService.remove(id);
  }
}
