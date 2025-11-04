import { Client } from 'pg';
const databaseUrl = process.env.DATABASE_URL;
const connectToDatabase = async () => {
  const client = new Client({
    connectionString: databaseUrl,
  });
  try {
    await client.connect();
    console.log("Kết nối đến database thành công!");
    return client;
  } catch (error) {
    console.error("Lỗi kết nối đến database:", error);
    throw error;
  }
};
export default connectToDatabase;