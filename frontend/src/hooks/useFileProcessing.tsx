import { useState, useCallback } from "react";
import { uploadFile, type IPFSUploadResult } from "../services/pinata";

export interface FileUploadResult extends IPFSUploadResult {
  fileName: string;
}

export const useFileProcessing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFileHandler = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await uploadFile(file);

        return {
          ...result,
          fileName: file.name,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "File upload failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile: uploadFileHandler,
    isLoading,
    error,
    clearError,
  };
};
