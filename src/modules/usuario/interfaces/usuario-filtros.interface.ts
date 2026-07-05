export interface UsuarioFiltros {
  nome?: string;
  email?: string;
  congregacaoId?: number;
  tipoUsuarioId?: number;
  page?: number;
  limit?: number;
}

export interface UsuarioLogado {
  id: number;
  email: string;
  tipoUsuarioId: number;
  permissoes: string[];
}
