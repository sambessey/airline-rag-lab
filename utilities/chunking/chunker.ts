type Chunk = {
  chunkIndex: number;
  headingPath: string[];
  content: string;
  metadata: Record<string, any>;
};

const def_targetTokens = 400;
const def_overlapTokens = 60;
const def_tokenLength = 4; // avg chars per token

function estimateTokens(s: string): number {
  // placeholder; in real code use a tokenizer (e.g., tiktoken) for your model
  return Math.ceil(s.length / def_tokenLength);
}

function extractDocMetadata(md: string) {
  const docTitle = (md.match(/^#\s+(.+)$/m)?.[1] ?? "").trim();

  const pick = (label: string) => {
    const re = new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.+)\\s*$`, "mi");
    return (md.match(re)?.[1] ?? "").trim();
  };

  return {
    doc_title: docTitle,
    policy_id: pick("Policy ID"),
    version: pick("Version"),
    effective: pick("Effective"),
    region: pick("Region"),
    owner: pick("Owner"),
  };
}

export function chunkPolicyMarkdown(
    md: string,
    targetTokens = def_targetTokens,
    overlapTokens = def_overlapTokens
): Chunk[] {
      // 1) split into sections by headings (H1/H2/H3)
  // 2) within each section, split into paragraphs / list blocks
  // 3) accumulate blocks until token budget exceeded
  // 4) emit chunk with headingPath + content
  // 5) add overlap by carrying last N tokens into next chunk
  const meta = extractDocMetadata(md);
  const docTitle = meta.doc_title || "Untitled";

  // Split on H2 headings (##). Keep heading + following body together.
  const parts = md.split(/\n(?=##\s+)/g).filter(s => s.trim().startsWith("## "));

  const chunks: Chunk[] = [];
  for (let i = 0; i < parts.length; i++) {
    const section = parts[i].trimEnd() + "\n";
    const h2 = section.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? `Section ${i}`;

    chunks.push({
      chunkIndex: i,
      headingPath: [docTitle, h2],
      content: section,
      metadata: meta,
    });
  }

  return chunks;
}