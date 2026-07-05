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
import { PermissaoService } from './permissao.service';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';

@Controller('permissoes')
export class PermissaoController {
  constructor(private readonly permissaoService: PermissaoService) { }

  @Post()
  @Permissao('permissao_criar')
  create(@Body() dto: CreatePermissaoDto) {
    return this.permissaoService.create(dto);
  }

  @Get()
  @Permissao('permissao_ver')
  findAll(
    @Query('nome') nome?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.permissaoService.findAll({
      nome,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('permissao_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissaoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('permissao_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissaoDto,
  ) {
    return this.permissaoService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('permissao_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissaoService.remove(id);
  }
}
