"use client";

import { useState } from "react";
import { TipoAnexoFuncionario } from "@/src/enums";

export interface PendingAnexo {
  id: number; // Temporário: 10000+
  file: File;
  tipo: TipoAnexoFuncionario;
}

export interface ExistingAnexo {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  tipo: TipoAnexoFuncionario;
  uploadedAt: string;
  downloadUrl?: string;
}

interface AnexoUploadProps {
  isReadOnly: boolean;
  pendingAnexos: PendingAnexo[];
  existingAnexos?: ExistingAnexo[];
  onAddAnexo: (anexo: PendingAnexo) => void;
  onRemovePending: (id: number) => void;
  onRemoveExisting?: (id: number) => void;
  maxAnexos?: number;
}

export function AnexoUpload({
  isReadOnly,
  pendingAnexos,
  existingAnexos = [],
  onAddAnexo,
  onRemovePending,
  onRemoveExisting,
  maxAnexos = 5,
}: AnexoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<TipoAnexoFuncionario>(
    TipoAnexoFuncionario.OUTRO
  );
  const [error, setError] = useState<string>("");

  const totalAnexos = existingAnexos.length + pendingAnexos.length;
  const canAddMore = totalAnexos < maxAnexos;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo: 5MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de arquivo inválido. Use JPG, PNG ou PDF");
      return;
    }

    setSelectedFile(file);
  };

  const handleAddAnexo = () => {
    if (!selectedFile) {
      setError("Selecione um arquivo");
      return;
    }

    if (!canAddMore) {
      setError(`Máximo de ${maxAnexos} anexos atingido`);
      return;
    }

    const newAnexo: PendingAnexo = {
      id: 10000 + pendingAnexos.length + 1,
      file: selectedFile,
      tipo: selectedTipo,
    };

    onAddAnexo(newAnexo);
    setSelectedFile(null);
    setError("");

    const input = document.getElementById("anexo-file") as HTMLInputElement;
    if (input) input.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
        Anexos ({totalAnexos}/{maxAnexos})
      </h3>

      {/* Upload de novos anexos */}
      {canAddMore && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label
                htmlFor="anexo-file"
                className="block text-sm font-medium text-white mb-2"
              >
                Selecionar Arquivo
              </label>
              <input
                id="anexo-file"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={isReadOnly}
                onChange={handleFileChange}
                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#DB9437] file:text-white hover:file:bg-[#c7812e] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="anexo-tipo"
                className="block text-sm font-medium text-white mb-2"
              >
                Tipo do Anexo
              </label>
              <select
                id="anexo-tipo"
                disabled={isReadOnly}
                value={selectedTipo}
                onChange={(e) =>
                  setSelectedTipo(e.target.value as TipoAnexoFuncionario)
                }
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {Object.values(TipoAnexoFuncionario).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {!isReadOnly && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddAnexo}
                  disabled={!selectedFile}
                  className="w-full bg-[#3770db] hover:bg-[#3770db]/80 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Adicionar
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {selectedFile && (
            <p className="text-white/70 text-sm">
              Selecionado: {selectedFile.name} (
              {formatFileSize(selectedFile.size)})
            </p>
          )}
        </div>
      )}

      {/* Lista de anexos existentes */}
      {existingAnexos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/90">Anexos Salvos</h4>
          {existingAnexos.map((anexo) => (
            <div
              key={`existing-${anexo.id}`}
              className="flex items-center justify-between bg-white/10 rounded-lg p-3"
            >
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {anexo.originalName}
                </p>
                <p className="text-white/60 text-xs">
                  {anexo.tipo} • {formatFileSize(anexo.size)}
                </p>
              </div>
              <div className="flex gap-2">
                {anexo.downloadUrl && (
                  <a
                    href={anexo.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Baixar
                  </a>
                )}
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(anexo.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de anexos pendentes */}
      {pendingAnexos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/90">
            Anexos Pendentes (aguardando envio)
          </h4>
          {pendingAnexos.map((anexo) => (
            <div
              key={`pending-${anexo.id}`}
              className="flex items-center justify-between bg-blue-500/20 rounded-lg p-3 border border-blue-400/30"
            >
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {anexo.file.name}
                </p>
                <p className="text-white/60 text-xs">
                  {anexo.tipo} • {formatFileSize(anexo.file.size)} • Pendente
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemovePending(anexo.id)}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {!canAddMore && (
        <p className="text-yellow-400 text-sm">
          Limite de {maxAnexos} anexos atingido. Remova algum para adicionar
          mais.
        </p>
      )}
    </div>
  );
}
