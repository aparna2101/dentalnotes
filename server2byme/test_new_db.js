const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://dentalnotes:Dental12326@cluster0.cea98.mongodb.net/DentalNotes?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  console.log('Connecting to new database...');
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Successfully connected!');
    const db = client.db('DentalNotes');
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(c => console.log(`  - ${c.name}`));
  } catch (e) {
    console.error('Connection failed:', e.message);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
