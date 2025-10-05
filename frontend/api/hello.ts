import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  console.log("endpoint hit");
  return c.json({ message: "Hello from Hono API" });
});

// export default handle(app);
export const GET = handle(app);
