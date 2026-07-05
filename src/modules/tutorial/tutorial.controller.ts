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
import { TutorialService } from './tutorial.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Controller('tutoriais')
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  @Post()
  @Permissao('tutorial_criar')
  create(@Body() dto: CreateTutorialDto) {
    return this.tutorialService.create(dto);
  }

  @Get()
  @Permissao('tutorial_ver')
  findAll(
    @Query('titulo') titulo?: string,
    @Query('tipoUsuarioId') tipoUsuarioId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tutorialService.findAll({
      titulo,
      tipoUsuarioId: tipoUsuarioId ? Number(tipoUsuarioId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Permissao('tutorial_ver')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tutorialService.findOne(id);
  }

  @Patch(':id')
  @Permissao('tutorial_editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTutorialDto,
  ) {
    return this.tutorialService.update(id, dto);
  }

  @Delete(':id')
  @Permissao('tutorial_excluir')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tutorialService.remove(id);
  }
}
