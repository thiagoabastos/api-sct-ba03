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
import { FormaPagamentoService } from './forma-pagamento.service';
import { CreateFormaPagamentoDto } from './dto/create-forma-pagamento.dto';
import { UpdateFormaPagamentoDto } from './dto/update-forma-pagamento.dto';

@Controller('formas-pagamento')
export class FormaPagamentoController {
  constructor(private readonly formaPagamentoService: FormaPagamentoService) {}

  @Post()
  @Permissao('config_geral_editar')
  create(@Body() dto: CreateFormaPagamentoDto) {
    return this.formaPagamentoService.create(dto);
  }

  @Get()
  @Permissao('arranjo_ver')
  findAll() {
    return this.formaPagamentoService.findAll();
  }

  @Get(':id')
  @Permissao('arranjo_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.formaPagamentoService.findOne(id);
  }

  @Patch(':id')
  @Permissao('config_geral_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFormaPagamentoDto,
  ) {
    return this.formaPagamentoService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('config_geral_editar')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.formaPagamentoService.remove(id);
  }
}
