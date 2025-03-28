export default () => ({
  port: Number(process.env.PORT!) || 3000,
  database: {
    url: process.env.POSTGRESQL_DB_URL! || '',
    port: process.env.POSTGRESQL_PORT || 4000,
  },
  aws: {
    services: {
      bedrock: {
        modelId: process.env.AWS_API_BEDROCK_MODEL_ID!,
        anthropicVersion: process.env.AWS_API_BEDROCK_ANTHROPIC_VERSION!,
        maxToken: Number(process.env.AWS_API_BEDROCK_MAX_TOKEN),
        temperature: Number(process.env.AWS_API_BEDROCK_TEMPERATURE),
      },
      defaultRegion: 'us-west-2',
    },
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  },
});
