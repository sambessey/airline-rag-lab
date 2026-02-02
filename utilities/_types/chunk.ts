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