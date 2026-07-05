import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PermissaoController } from './permissao.controller';
import { PermissaoService } from './permissao.service';

@Module({
  controllers: [PermissaoController],
  providers: [PermissaoService, PrismaService],
  exports: [PermissaoService],
})
export class PermissaoModule {}
