import { readFileSync } from 'fs';
import { Client } from "pg";
import {embedQuery} from "./embedding/embed_query";
import {queryOne} from "./dbops/query";
import type { Chunk } from "./_types/chunk";

const userQuery = process.argv[2];
//const fileContents = readFileSync(fileName, 'utf-8');

//let a: Chunk[] = chunkPolicyMarkdown(fileContents);


//if (a[0]?.chunkIndex === 0) {
async function main(){
const pg = await connectPG()
try {
      const embedding = await embedQuery(userQuery); 
      await queryOne(pg, embedding);
  } finally {
    await pg.end();
  }
}
main().catch(console.error);

function makeEmbeddingInput(c: Chunk): string {
  // Keep it short but consistent. This is what the embedding model sees.
  const header =
    `Policy: ${c.metadata.policy_id} v${c.metadata.version}\n` +
    `Doc: ${c.metadata.doc_title}\n` +
    `Section: ${c.headingPath.slice(1).join(" > ")}\n`;

  return `${header}\n${c.content}`;
}

async function connectPG(): Promise<Client> {
    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    return pg;
}