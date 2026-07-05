import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { PagamentoArranjoCongregacaoService } from './pagamento-arranjo-congregacao.service';
import { CreatePagamentoArranjoCongregacaoDto } from './dto/create-pagamento-arranjo-congregacao.dto';

@Controller('pagamentos-arranjo')
export class PagamentoArranjoCongregacaoController {
  constructor(
    private readonly pagamentoService: PagamentoArranjoCongregacaoService,
  ) {}

  @Post()
  @Permissao('arranjo_editar')
  create(@Body() dto: CreatePagamentoArranjoCongregacaoDto) {
    return this.pagamentoService.create(dto);
  }

  @Get()
  @Permissao('arranjo_ver')
  findAll(
    @Query('arranjoCongregacaoId') arranjoCongregacaoId?: string,
    @Query('formaPagamentoId') formaPagamentoId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pagamentoService.findAll({
      arranjoCongregacaoId: arranjoCongregacaoId
        ? Number(arranjoCongregacaoId)
        : undefined,
      formaPagamentoId: formaPagamentoId ? Number(formaPagamentoId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // Retorna todos os pagamentos de um arranjo + resumo financeiro
  @Get('arranjo/:arranjoCongregacaoId')
  @Permissao('arranjo_ver')
  findByArranjo(
    @Param('arranjoCongregacaoId', ParseIntPipe) arranjoCongregacaoId: number,
  ) {
    return this.pagamentoService.findByArranjo(arranjoCongregacaoId);
  }

  @Get(':id')
  @Permissao('arranjo_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoService.findOne(id);
  }

  @Delete(':id')
  @Permissao('arranjo_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoService.remove(id);
  }
}
