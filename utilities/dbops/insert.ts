import { Client } from "pg";
import type { Chunk } from "../_types/chunk";

function toPgVectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`;
}

export async function insertOne(pg: Client, source: string, c: Chunk, embedding: number[]) {
  //  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  //  await pg.connect();
   // try{
        await pg.query(
        `
        INSERT INTO docs (source, chunk_index, content, metadata, embedding)
        VALUES ($1, $2, $3, $4, $5::vector)
        ON CONFLICT (source, chunk_index) DO UPDATE
        SET content = EXCLUDED.content,
            metadata = EXCLUDED.metadata,
            embedding = EXCLUDED.embedding;
        `,
        [
        source,
        c.chunkIndex,
        c.content,
        JSON.stringify({ ...c.metadata, headingPath: c.headingPath }),
        toPgVectorLiteral(embedding),
        ]
    );
  //} finally {
  //  await pg.end();
//  }
}
