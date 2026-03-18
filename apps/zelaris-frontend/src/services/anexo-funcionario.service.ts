import type { ApiResponse } from '@/src/models/api.model';
import type { AnexoFuncionario } from '@/src/models/funcionario.model';
import { TipoAnexoFuncionario } from '@/src/enums';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const anexoFuncionarioService = {

  async upload(
    funcionarioId: number,
    file: File,
    tipo: TipoAnexoFuncionario
  ): Promise<ApiResponse<AnexoFuncionario>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);

    const response = await fetch(
      `${API_URL}/anexo-funcionario/${funcionarioId}`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao fazer upload' }));
      throw new Error(error.message || 'Erro ao fazer upload do anexo');
    }

    return response.json();
  },

  async list(
    funcionarioId: number
  ): Promise<ApiResponse<AnexoFuncionario[]>> {
    const response = await fetch(
      `${API_URL}/anexo-funcionario/${funcionarioId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao listar anexos' }));
      throw new Error(error.message || 'Erro ao listar anexos');
    }

    return response.json();
  },

  async delete(funcionarioId: number, anexoId: number): Promise<null> {
    const response = await fetch(`${API_URL}/anexo-funcionario/${funcionarioId}/${anexoId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao remover anexo' }));
      throw new Error(error.message || 'Erro ao remover anexo');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },
};
