import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.PINATA_JWT || "",
  pinataGateway: import.meta.env.VITE_GATEWAY_URL || "",
});

export interface IPFSUploadResult {
  cid: string;
  url: string;
}

export const getPresignedUrl = async (): Promise<string> => {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
  const response = await fetch(`${serverUrl}/api/presigned_url`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  const data = await response.json();
  return data.url;
};

export const uploadFile = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const presignedUrl = await getPresignedUrl();

    const upload = await pinata.upload.public.file(file).url(presignedUrl);

    if (!upload.cid) {
      throw new Error("Upload failed - no CID returned");
    }

    const gatewayUrl = await pinata.gateways.public.convert(upload.cid);

    return {
      cid: upload.cid,
      url: gatewayUrl,
    };
  } catch (error) {
    throw new Error(
      `IPFS upload failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getFileUrl = (cid: string): string => {
  return `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`;
};
