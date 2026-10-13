import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { app } from "./src/app.js";

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] Running on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

start();
