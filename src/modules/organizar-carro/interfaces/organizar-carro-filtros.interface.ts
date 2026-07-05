export interface OrganizarCarroFiltros {
  eventoId?: number;
  congregacaoId?: number;
  capitaoId?: number;
  dia?: string;
  page?: number;
  limit?: number;
}

export interface ApanhaFiltros {
  congregacaoId?: number;
  local?: string;
  page?: number;
  limit?: number;
}
