const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://DentalNotes:DentalNotes1226@cluster0.2rqkkqw.mongodb.net/DentalNotes?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db('DentalNotes');
    const result = await db.collection('User').deleteMany({ email: 'ajayk061999@gmail.com' });
    console.log(`Deleted ${result.deletedCount} user(s) with email ajayk061999@gmail.com`);
  } catch (e) {
    console.error('Delete failed:', e.message);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
