import "dotenv/config";
import OpenAI from "openai";
export interface Chunk {
  chunkIndex: number;
  headingPath: string[];
  content: string;
  metadata: {
    doc_title: string;
    policy_id: string;
    version: string;
    effective: string;
    region: string;
    owner: string;
  };
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//THIS IS BLOG 1 - EMBEDDING A SAMPLE TEXT

const text = `## Gold Tier: Reaccommodation Priority
For Gold customers during IRROPS:
- Attempt same-day reaccommodation first.
- If multiple options exist, choose the one with the earliest arrival time.
- Offer partner rebooking when eligible (see Partner Guidelines).`;

async function main() {
  const resp = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const v = resp.data[0].embedding;
  console.log("dims:", v.length);
  console.log("head:", v.slice(0, 5));
}
//NEXT LINE COMMENTED OUT BUT IS PART OF BLOG 1
//main().catch(console.error);

// THIS IS BLOG 2 - EMBEDDING A CHUNK. THIS REPLACES MAIN

async function embedOne(text: string): Promise<number[]> {
  const r = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return r.data[0].embedding;
}

/*async function main(chunks: Chunk[]) {
  const input = makeEmbeddingInput(chunks[0]);
  const v = await embedOne(input);
  console.log("dims:", v.length);     // MUST be 1536
  console.log("head:", v.slice(0, 5));

}*/

export async function embedChunk(text: String): Promise<number[]> {
    const embedding = await embedOne(text);
    console.log("dims:", embedding.length);     // MUST be 1536
    console.log("head:", embedding.slice(0, 5));
    return embedding;
}