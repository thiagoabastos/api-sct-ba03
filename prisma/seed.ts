import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed...');

    // ----------------------------------------------------------------
    // PERMISSÕES
    // ----------------------------------------------------------------
    const permissoes = await Promise.all([
        // Congregação
        prisma.permissao.upsert({
            where: { nome: 'congregacao_ver' },
            update: {},
            create: { nome: 'congregacao_ver', descricao: 'Visualizar congregações' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'congregacao_criar' },
            update: {},
            create: { nome: 'congregacao_criar', descricao: 'Criar congregações' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'congregacao_editar' },
            update: {},
            create: { nome: 'congregacao_editar', descricao: 'Editar congregações' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'congregacao_excluir' },
            update: {},
            create: { nome: 'congregacao_excluir', descricao: 'Excluir congregações' },
        }),

        // Usuário
        prisma.permissao.upsert({
            where: { nome: 'usuario_ver' },
            update: {},
            create: { nome: 'usuario_ver', descricao: 'Visualizar usuários' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'usuario_criar' },
            update: {},
            create: { nome: 'usuario_criar', descricao: 'Criar usuários' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'usuario_editar' },
            update: {},
            create: { nome: 'usuario_editar', descricao: 'Editar usuários' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'usuario_excluir' },
            update: {},
            create: { nome: 'usuario_excluir', descricao: 'Excluir usuários' },
        }),

        // Evento
        prisma.permissao.upsert({
            where: { nome: 'evento_ver' },
            update: {},
            create: { nome: 'evento_ver', descricao: 'Visualizar eventos' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'evento_criar' },
            update: {},
            create: { nome: 'evento_criar', descricao: 'Criar eventos' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'evento_editar' },
            update: {},
            create: { nome: 'evento_editar', descricao: 'Editar eventos' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'evento_excluir' },
            update: {},
            create: { nome: 'evento_excluir', descricao: 'Excluir eventos' },
        }),

        // Arranjo
        prisma.permissao.upsert({
            where: { nome: 'arranjo_ver' },
            update: {},
            create: { nome: 'arranjo_ver', descricao: 'Visualizar arranjos' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'arranjo_criar' },
            update: {},
            create: { nome: 'arranjo_criar', descricao: 'Criar arranjos' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'arranjo_editar' },
            update: {},
            create: { nome: 'arranjo_editar', descricao: 'Editar arranjos' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'arranjo_excluir' },
            update: {},
            create: { nome: 'arranjo_excluir', descricao: 'Excluir arranjos' },
        }),

        // Organizar Carro
        prisma.permissao.upsert({
            where: { nome: 'organizar_carro_ver' },
            update: {},
            create: { nome: 'organizar_carro_ver', descricao: 'Visualizar organização de carros' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'organizar_carro_criar' },
            update: {},
            create: { nome: 'organizar_carro_criar', descricao: 'Criar organização de carros' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'organizar_carro_editar' },
            update: {},
            create: { nome: 'organizar_carro_editar', descricao: 'Editar organização de carros' },
        }),

        // Config Geral
        prisma.permissao.upsert({
            where: { nome: 'config_geral_ver' },
            update: {},
            create: { nome: 'config_geral_ver', descricao: 'Visualizar configurações gerais' },
        }),
        prisma.permissao.upsert({
            where: { nome: 'config_geral_editar' },
            update: {},
            create: { nome: 'config_geral_editar', descricao: 'Editar configurações gerais' },
        }),
    ]);

    console.log(`✅ ${permissoes.length} permissões criadas/atualizadas`);

    // ----------------------------------------------------------------
    // TIPOS DE USUÁRIO
    // ----------------------------------------------------------------

    // Busca IDs das permissões criadas para vincular
    const todasPermissoes = await prisma.permissao.findMany();
    const perm = (nome: string) => todasPermissoes.find((p) => p.nome === nome)!;

    const tipoAdmin = await prisma.tipoUsuario.upsert({
        where: { nome: 'Admin' },
        update: {},
        create: {
            nome: 'Admin',
            descricao: 'Acesso total ao sistema',
            permissoes: {
                create: todasPermissoes.map((p) => ({
                    permissao: { connect: { id: p.id } },
                })),
            },
        },
    });

    const tipoResponsavel = await prisma.tipoUsuario.upsert({
        where: { nome: 'Responsavel' },
        update: {},
        create: {
            nome: 'Responsavel',
            descricao: 'Responsavel pelas congregações',
            permissoes: {
                create: [
                    'congregacao_ver',
                    'evento_ver',
                    'arranjo_ver',
                    'arranjo_criar',
                    'arranjo_editar',
                    'organizar_carro_ver',
                    'organizar_carro_criar',
                    'organizar_carro_editar',
                ].map((nome) => ({
                    permissao: { connect: { id: perm(nome).id } },
                })),
            },
        },
    });

    const tipoAjudante = await prisma.tipoUsuario.upsert({
        where: { nome: 'Ajudante' },
        update: {},
        create: {
            nome: 'Ajudante',
            descricao: 'Ajudante do responsável pelas congregações',
            permissoes: {
                create: [
                    'congregacao_ver',
                    'evento_ver',
                    'arranjo_ver',
                    'organizar_carro_ver',
                ].map((nome) => ({
                    permissao: { connect: { id: perm(nome).id } },
                })),
            },
        },
    });

    console.log('✅ Tipos de usuário criados/atualizados: Admin, Organizador, Lider');

    // ----------------------------------------------------------------
    // CONGREGAÇÕES
    // ----------------------------------------------------------------
    const congregacoes = await Promise.all([
        prisma.congregacao.upsert({
            where: { nome: 'Congregação Central' },
            update: {},
            create: { nome: 'Congregação Central' },
        }),
        prisma.congregacao.upsert({
            where: { nome: 'Congregação Norte' },
            update: {},
            create: { nome: 'Congregação Norte' },
        }),
        prisma.congregacao.upsert({
            where: { nome: 'Congregação Sul' },
            update: {},
            create: { nome: 'Congregação Sul' },
        }),
        prisma.congregacao.upsert({
            where: { nome: 'Congregação Leste' },
            update: {},
            create: { nome: 'Congregação Leste' },
        }),
        prisma.congregacao.upsert({
            where: { nome: 'Congregação Oeste' },
            update: {},
            create: { nome: 'Congregação Oeste' },
        }),
    ]);

    console.log(`✅ ${congregacoes.length} congregações criadas/atualizadas`);

    // ----------------------------------------------------------------
    // USUÁRIOS
    // ----------------------------------------------------------------
    const SALT_ROUNDS = 10;

    const usuarios = await Promise.all([
        prisma.usuario.upsert({
            where: { email: 'ticobtj@gmail.com' },
            update: {},
            create: {
                nome: 'Administrador',
                email: 'ticobtj@gmail.com',
                celular: '71999990000',
                senha: await bcrypt.hash('Admin@123', SALT_ROUNDS),
                senhaCreate: new Date(),
                congregacao: { connect: { id: congregacoes[0].id } },
                tipoUsuario: { connect: { id: tipoAdmin.id } },
            },
        }),
        prisma.usuario.upsert({
            where: { email: 'joao.responsavel@sistema.com' },
            update: {},
            create: {
                nome: 'João responsavel',
                email: 'joao.responsavel@sistema.com',
                celular: '71999991111',
                senha: await bcrypt.hash('Responsavel@123', SALT_ROUNDS),
                senhaCreate: new Date(),
                congregacao: { connect: { id: congregacoes[0].id } },
                tipoUsuario: { connect: { id: tipoResponsavel.id } },
            },
        }),
        prisma.usuario.upsert({
            where: { email: 'maria.ajudante@sistema.com' },
            update: {},
            create: {
                nome: 'Maria ajudante',
                email: 'maria.ajudante@sistema.com',
                celular: '71999992222',
                senha: await bcrypt.hash('Ajudante@123', SALT_ROUNDS),
                senhaCreate: new Date(),
                congregacao: { connect: { id: congregacoes[1].id } },
                tipoUsuario: { connect: { id: tipoAjudante.id } },
            },
        }),
        prisma.usuario.upsert({
            where: { email: 'pedro.ajudante@sistema.com' },
            update: {},
            create: {
                nome: 'Pedro ajudante',
                email: 'pedro.ajudante@sistema.com',
                celular: '71999993333',
                senha: await bcrypt.hash('Ajudante@123', SALT_ROUNDS),
                senhaCreate: new Date(),
                congregacao: { connect: { id: congregacoes[2].id } },
                tipoUsuario: { connect: { id: tipoAjudante.id } },
            },
        }),
    ]);

    console.log(`✅ ${usuarios.length} usuários criados/atualizados`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Credenciais para acesso:');
    console.log('   Admin        → ticobtj@gmail.com        / Admin@123');
    console.log('   Organizador  → joao.responsavel@sistema.com  / Responsavel@123');
    console.log('   Líder Norte  → maria.ajudante@sistema.com  / Ajudante@123');
    console.log('   Líder Sul    → pedro.ajudante@sistema.com    / Ajudante@123');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });