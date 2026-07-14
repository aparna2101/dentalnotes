const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://shakir973019:38Av2920Jt6uBzIu@cargarage.v8iwejy.mongodb.net/?retryWrites=true&w=majority&appName=DentalNotes';

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db('SHADICOM');
  const subjects = await db.collection('Subject').find({}).toArray();
  console.log('--- SUBJECTS IN SHADICOM ---');
  console.log(subjects);
  await client.close();
}

main().catch(console.error);
