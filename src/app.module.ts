import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CongregacaoModule } from './modules/congregacao/congregacao.module';

@Module({
  imports: [AuthModule, CongregacaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
