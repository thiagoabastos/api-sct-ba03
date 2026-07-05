import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { HierarquiaUsuarioGuard } from './guards/hierarquia-usuario.guard';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, HierarquiaUsuarioGuard, PrismaService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
