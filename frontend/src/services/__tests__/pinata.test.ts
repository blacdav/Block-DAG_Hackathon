import { uploadFile, getPresignedUrl } from "../pinata";

vi.mock("pinata", () => ({
  PinataSDK: vi.fn().mockImplementation(() => ({
    upload: {
      public: {
        file: vi.fn().mockReturnValue({
          url: vi.fn().mockResolvedValue({ cid: "test-cid-123" }),
        }),
      },
    },
    gateways: {
      public: {
        convert: vi
          .fn()
          .mockResolvedValue("https://gateway.pinata.cloud/ipfs/test-cid-123"),
      },
    },
  })),
}));

globalThis.fetch = vi.fn();

describe("Pinata Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getPresignedUrl should fetch URL from backend", async () => {
    const mockUrl = "https://presigned.pinata.cloud/upload";

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: mockUrl }),
    });

    const result = await getPresignedUrl();
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    expect(fetch).toHaveBeenCalledWith(`${serverUrl}/api/presigned_url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(result).toBe(mockUrl);
  });

  test("uploadFile should upload using presigned URL", async () => {
    const mockFile = new File(["test content"], "test.txt");
    const mockPresignedUrl = "https://presigned.pinata.cloud/upload";

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: mockPresignedUrl }),
    });

    const result = await uploadFile(mockFile);
    console.log(result);
    expect(result).toEqual({
      cid: "test-cid-123",
      url: "https://gateway.pinata.cloud/ipfs/test-cid-123",
    });
  });

  test("should throw error when presigned URL fetch fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const mockFile = new File(["test"], "test.txt");

    await expect(uploadFile(mockFile)).rejects.toThrow(
      "Failed to get upload URL"
    );
  });
});
