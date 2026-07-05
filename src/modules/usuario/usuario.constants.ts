// Hierarquia de quais tipos cada perfil pode criar
// Chave: tipo do usuário logado | Valor: tipos que ele pode criar
export const HIERARQUIA_CRIACAO: Record<string, string[]> = {
  Admin: ['Admin', 'Responsavel', 'Ajudante', 'Capitao'],
  Responsavel: ['Responsavel', 'Ajudante', 'Capitao'],
  Ajudante: ['Ajudante', 'Capitao'],
  Capitao: [], // não pode criar nenhum
};
