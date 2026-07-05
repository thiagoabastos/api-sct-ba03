import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CongregacaoModule } from './modules/congregacao/congregacao.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { TipoUsuarioModule } from './modules/tipo-usuario/tipo-usuario.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { EventoModule } from './modules/evento/evento.module';
import { AuditorioModule } from './modules/auditorio/auditorio.module';
import { EventoTipoModule } from './modules/evento-tipo/evento-tipo.module';
import { ArranjoCongregacaoModule } from './modules/arranjo-congregacao/arranjo-congregacao.module';
import { FormaPagamentoModule } from './modules/forma-pagamento/forma-pagamento.module';
import { TutorialModule } from './modules/tutorial/tutorial.module';
import { NomeArranjoCongregacaoModule } from './modules/nome-arranjo-congregacao/nome-arranjo-congregacao.module';
import { PagamentoArranjoCongregacaoModule } from './modules/pagamento-arranjo-congregacao/pagamento-arranjo-congregacao.module';
import { ApanhaModule } from './modules/apanha/apanha.module';
import { OrganizarCarroModule } from './modules/organizar-carro/organizar-carro.module';
import { ControleQualidadeModule } from './modules/controle-qualidade/controle-qualidade.module';
import { DocumentoModule } from './modules/documento/documento.module';

@Module({
  imports: [AuthModule, CongregacaoModule, PermissaoModule, TipoUsuarioModule, UsuarioModule, PessoaModule, EmpresaModule, EventoModule, AuditorioModule, EventoTipoModule, ArranjoCongregacaoModule, FormaPagamentoModule, TutorialModule, NomeArranjoCongregacaoModule, PagamentoArranjoCongregacaoModule, ApanhaModule, OrganizarCarroModule, ControleQualidadeModule, DocumentoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
