function toPgVectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`;
}

export async function queryOne(pg,qEmbedding:number[]) {
const qVec = toPgVectorLiteral(qEmbedding);

  const rows = await pg.query(
    `SELECT source, chunk_index, (embedding <=> $1::vector) AS dist, left(content, 120) AS snippet
    FROM docs
    ORDER BY embedding <=> $1::vector
    LIMIT 5;`,
    [qVec]
  );
  console.log("Top 5 results:");
  for (const r of rows.rows) {
    console.log(
      `Source: ${r.source} | Chunk: ${r.chunk_index} | Distance: ${r.dist}\nSnippet: ${r.snippet}\n---`
    );
  }
}
