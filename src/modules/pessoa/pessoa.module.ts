import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

@Module({
  controllers: [PessoaController],
  providers: [PessoaService, PrismaService],
  exports: [PessoaService],
})
export class PessoaModule {}
