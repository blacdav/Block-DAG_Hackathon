import { Hono } from "hono";
import { cors } from "hono/cors";
import { PinataSDK } from "pinata";
import { handle } from "hono/vercel";

interface Bindings {
  PINATA_JWT: string;
  GATEWAY_URL: string;
}

const app = new Hono().basePath("/api");

app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/presigned_url", async (c) => {
  // Handle Auth

  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
  });

  const url = await pinata.upload.public.createSignedURL({
    expires: 60, // Last for 60 seconds
  });

  return c.json({ url }, { status: 200 });
});

export const GET = handle(app);
