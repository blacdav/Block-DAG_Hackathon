import { renderHook, act } from "@testing-library/react";
import { useFileProcessing } from "../useFileProcessing";
import { uploadFile } from "../../services/pinata";
import type { MockedFunction } from "vitest";

vi.mock("../../services/pinata");

const mockUploadFile = uploadFile as MockedFunction<typeof uploadFile>;

describe("useFileProcessing Hook", () => {
  const mockFile = new File(["test content"], "test.txt");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("uploadFile should upload file and return result", async () => {
    mockUploadFile.mockResolvedValue({
      cid: "test-cid-123",
      url: "https://gateway.pinata.cloud/ipfs/test-cid-123",
    });

    const { result } = renderHook(() => useFileProcessing());

    let uploadResult;
    await act(async () => {
      uploadResult = await result.current.uploadFile(mockFile);
    });

    expect(mockUploadFile).toHaveBeenCalledWith(mockFile);
    expect(uploadResult).toEqual({
      cid: "test-cid-123",
      url: "https://gateway.pinata.cloud/ipfs/test-cid-123",
      fileName: "test.txt",
    });
  });

  test("should handle upload errors", async () => {
    mockUploadFile.mockRejectedValue(new Error("Upload failed"));

    const { result } = renderHook(() => useFileProcessing());

    await act(async () => {
      await expect(result.current.uploadFile(mockFile)).rejects.toThrow(
        "Upload failed"
      );
    });

    expect(result.current.error).toBe("Upload failed");
  });

  test("should track loading state during upload", async () => {
    mockUploadFile.mockResolvedValue({
      cid: "test-cid-123",
      url: "https://gateway.pinata.cloud/ipfs/test-cid-123",
    });

    const { result } = renderHook(() => useFileProcessing());

    expect(result.current.isLoading).toBe(false);

    let uploadPromise: Promise<any>;
    await act(async () => {
      uploadPromise = result.current.uploadFile(mockFile);
    });
    console.log(result.current.isLoading);
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await uploadPromise;
    });
    console.log(result.current.isLoading);
    expect(result.current.isLoading).toBe(false);
  });
});
