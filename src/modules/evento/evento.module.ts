import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditorioModule } from '../auditorio/auditorio.module';
import { EventoTipoModule } from '../evento-tipo/evento-tipo.module';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';

@Module({
  imports: [AuditorioModule, EventoTipoModule],
  controllers: [EventoController],
  providers: [EventoService, PrismaService],
  exports: [EventoService],
})
export class EventoModule {}
