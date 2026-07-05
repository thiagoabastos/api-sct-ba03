export interface UsuarioLogado {
  id: number;
  email: string;
  tipoUsuarioId: number;
  permissoes: string[];
}
