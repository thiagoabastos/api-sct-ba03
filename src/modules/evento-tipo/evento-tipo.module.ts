import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventoTipoController } from './evento-tipo.controller';
import { EventoTipoService } from './evento-tipo.service';

@Module({
  controllers: [EventoTipoController],
  providers: [EventoTipoService, PrismaService],
  exports: [EventoTipoService],
})
export class EventoTipoModule {}
