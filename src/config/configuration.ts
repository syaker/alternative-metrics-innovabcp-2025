export default () => ({
  port: Number(process.env.PORT!) || 3000,
  database: {
    url: process.env.POSTGRESQL_DB_URL! || '',
    port: process.env.POSTGRESQL_PORT || 4000,
  },
});
