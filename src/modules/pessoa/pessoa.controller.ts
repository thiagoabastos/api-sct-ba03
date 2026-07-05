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
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Controller('pessoas')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) { }

  @Post()
  @Permissao('pessoa_criar')
  create(@Body() dto: CreatePessoaDto) {
    return this.pessoaService.create(dto);
  }

  @Get()
  @Permissao('pessoa_ver')
  findAll(
    @Query('nome') nome?: string,
    @Query('congregacaoId') congregacaoId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pessoaService.findAll({
      nome,
      congregacaoId: congregacaoId ? Number(congregacaoId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('congregacao/:congregacaoId')
  @Permissao('pessoa_ver')
  findByCongregacao(
    @Param('congregacaoId', ParseIntPipe) congregacaoId: number,
  ) {
    return this.pessoaService.findByCongregacao(congregacaoId);
  }

  @Get(':id')
  @Permissao('pessoa_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pessoaService.findOne(id);
  }

  @Patch(':id')
  @Permissao('pessoa_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePessoaDto,
  ) {
    return this.pessoaService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('pessoa_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pessoaService.remove(id);
  }
}
