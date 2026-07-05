import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { NomeArranjoCongregacaoService } from './nome-arranjo-congregacao.service';
import { CreateNomeArranjoCongregacaoDto } from './dto/create-nome-arranjo-congregacao.dto';
import { UpdateNomeArranjoCongregacaoDto } from './dto/update-nome-arranjo-congregacao.dto';

@Controller('nomes-arranjo')
export class NomeArranjoCongregacaoController {
  constructor(
    private readonly nomeArranjoService: NomeArranjoCongregacaoService,
  ) {}

  @Post()
  @Permissao('arranjo_criar')
  create(@Body() dto: CreateNomeArranjoCongregacaoDto) {
    return this.nomeArranjoService.create(dto);
  }

  @Get()
  @Permissao('arranjo_ver')
  findAll(
    @Query('arranjoCongregacaoId') arranjoCongregacaoId?: string,
    @Query('pessoaId') pessoaId?: string,
    @Query('menorIdade') menorIdade?: string,
    @Query('sexta') sexta?: string,
    @Query('sabado') sabado?: string,
    @Query('domingo') domingo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.nomeArranjoService.findAll({
      arranjoCongregacaoId: arranjoCongregacaoId
        ? Number(arranjoCongregacaoId)
        : undefined,
      pessoaId: pessoaId ? Number(pessoaId) : undefined,
      menorIdade: menorIdade !== undefined ? menorIdade === 'true' : undefined,
      sexta: sexta !== undefined ? sexta === 'true' : undefined,
      sabado: sabado !== undefined ? sabado === 'true' : undefined,
      domingo: domingo !== undefined ? domingo === 'true' : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // Retorna todos os nomes de um arranjo agrupados por dia
  @Get('arranjo/:arranjoCongregacaoId')
  @Permissao('arranjo_ver')
  findByArranjo(
    @Param('arranjoCongregacaoId', ParseIntPipe) arranjoCongregacaoId: number,
  ) {
    return this.nomeArranjoService.findByArranjo(arranjoCongregacaoId);
  }

  @Get(':id')
  @Permissao('arranjo_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nomeArranjoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('arranjo_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNomeArranjoCongregacaoDto,
  ) {
    return this.nomeArranjoService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('arranjo_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.nomeArranjoService.remove(id);
  }
}
