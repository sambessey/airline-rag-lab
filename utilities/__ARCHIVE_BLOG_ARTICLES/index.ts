import { readFileSync } from 'fs';
import { chunkPolicyMarkdown } from "./chunking/chunker";
import {embedChunk} from "./embedding/embed_one";
import {insertOne} from "./dbops/insert";
import type { Chunk } from "./_types/chunk";

const fileName = process.argv[2];
const fileContents = readFileSync(fileName, 'utf-8');

//THIS IS BLOG 1 - PRODUCING CHUNKS

let a: Chunk[] = chunkPolicyMarkdown(fileContents);
console.log(a);

//THIS IS BLOG 2 - PRODUCING CHUNK INDEXES

if (a[0]?.chunkIndex === 0) {
    console.log('RETURNING CHUNK 0 NEXT')
    console.log(makeEmbeddingInput(a[0]));
    let chunk = embedChunk(makeEmbeddingInput(a[0]));
    //THE THEN BLOCK BELOW IS PART OF BLOG 3 - INSERTING THE EMBEDDING INTO THE DB

    chunk.then((embedding) => {
        console.log('EMBEDDING RECEIVED, inserting to DB');
        console.log(embedding);
        insertOne("HelpDocs", a[0], embedding);
    })

}

function makeEmbeddingInput(c: Chunk): string {
  // Keep it short but consistent. This is what the embedding model sees.
  const header =
    `Policy: ${c.metadata.policy_id} v${c.metadata.version}\n` +
    `Doc: ${c.metadata.doc_title}\n` +
    `Section: ${c.headingPath.slice(1).join(" > ")}\n`;

  return `${header}\n${c.content}`;
}