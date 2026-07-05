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
} from '@nestjs/common';
import { Permissao } from '../../common/decorators/permissao.decorator';
import { AuditorioService } from './auditorio.service';
import { CreateAuditorioDto } from './dto/create-auditorio.dto';
import { UpdateAuditorioDto } from './dto/update-auditorio.dto';

@Controller('auditorios')
export class AuditorioController {
  constructor(private readonly auditorioService: AuditorioService) { }

  @Post()
  @Permissao('auditorio_criar')
  create(@Body() dto: CreateAuditorioDto) {
    return this.auditorioService.create(dto);
  }

  @Get()
  @Permissao('auditorio_ver')
  findAll() {
    return this.auditorioService.findAll();
  }

  @Get(':id')
  @Permissao('auditorio_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditorioService.findOne(id);
  }

  @Patch(':id')
  @Permissao('auditorio_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuditorioDto,
  ) {
    return this.auditorioService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('auditorio_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.auditorioService.remove(id);
  }
}
