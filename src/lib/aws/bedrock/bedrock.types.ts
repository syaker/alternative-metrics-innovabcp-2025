export type RawCommandOutput = {
  content: { text: string }[];
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
};
