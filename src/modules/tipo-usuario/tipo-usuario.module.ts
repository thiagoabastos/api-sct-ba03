import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TipoUsuarioController } from './tipo-usuario.controller';
import { TipoUsuarioService } from './tipo-usuario.service';

@Module({
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService, PrismaService],
  exports: [TipoUsuarioService],
})
export class TipoUsuarioModule {}
