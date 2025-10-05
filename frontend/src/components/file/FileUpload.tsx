import React, { useRef } from "react";
import { useFileProcessing } from "../../hooks/useFileProcessing";

export const FileUpload: React.FC = () => {
  const { uploadFile, isLoading, error } = useFileProcessing();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      console.log("File uploaded:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 border rounded-lg">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? "Uploading..." : "Upload File"}
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};
