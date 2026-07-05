import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documento')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) { }

  @Post()
  @Permissao('documento_criar')
  create(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentoService.create(createDocumentoDto);
  }

  @Get()
  @Permissao('documento_listar')
  findAll(
    @Query('nome') nome?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.documentoService.findAll({
      nome,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get(':id')
  @Permissao('documento_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('documento_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
  ) {
    return this.documentoService.update(id, updateDocumentoDto);
  }

  @Delete(':id')
  @Permissao('documento_excluir')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentoService.remove(id);
  }
}
