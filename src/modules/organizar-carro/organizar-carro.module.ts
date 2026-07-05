import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrganizarCarroController } from './organizar-carro.controller';
import { OrganizarCarroService } from './organizar-carro.service';
import { ApanhaService } from './apanha.service';

@Module({
  controllers: [OrganizarCarroController],
  providers: [OrganizarCarroService, ApanhaService, PrismaService],
  exports: [OrganizarCarroService, ApanhaService],
})
export class OrganizarCarroModule {}
