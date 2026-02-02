import { readFileSync } from 'fs';
import { Client } from "pg";
import { chunkPolicyMarkdown } from "./chunking/chunker";
import {embedChunk} from "./embedding/embed_one";
import {insertOne} from "./dbops/insert";
import type { Chunk } from "./_types/chunk";

const fileName = process.argv[2];
const fileContents = readFileSync(fileName, 'utf-8');

let a: Chunk[] = chunkPolicyMarkdown(fileContents);


//if (a[0]?.chunkIndex === 0) {
async function main(){
const pg = await connectPG()
try {
for (let i = 0; i < a.length; i++) {
    console.log(`Returning # ${i} of ${a.length} chunks`);
    console.log(makeEmbeddingInput(a[0]));
      const embedding = await embedChunk(makeEmbeddingInput(a[i]));
      console.log(`Embedding for chunk ${i} received - Inserting to DB`);
      console.log(`${embedding[0]} ...etc`);
      
      await insertOne(pg, `HelpDocs`, a[i], embedding);
    }
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