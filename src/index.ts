import { PrismaClient } from "prisma/prisma-client";
import Fastify from "fastify";
import { nanoid } from "nanoid";

const fastify = Fastify({ logger: true });
const db = new PrismaClient({ log: ["query", "info", "warn", "error"] });
const genId = () => nanoid(16);

const seedDatabase = async () => {
  if ((await db.post.count()) === 0)
    return await Promise.all([
      db.post.create({
        data: {
          id: genId(),
          slug: "ultimate-node-stack",
          title: "The Ultimate Node/Docker Setup",
        },
      }),
      db.post.create({
        data: {
          id: genId(),
          slug: "future-blog-post",
          title: "Future Blog Post",
        },
      }),
    ]);
};
seedDatabase();

fastify.get("/", async () => {
  return db.post.findMany();
});

const port = process.env.PORT ?? 8080;
const start = async () => {
  try {
    await fastify.listen(port, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
