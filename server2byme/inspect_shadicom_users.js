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
  console.log('Connected!');

  const db = client.db('SHADICOM');
  const users = await db.collection('User').find({}).toArray();
  console.log('--- USERS IN SHADICOM ---');
  console.log(users.map(u => ({ email: u.email, createdAt: u.createdAt })));

  await client.close();
}

main().catch(console.error);
