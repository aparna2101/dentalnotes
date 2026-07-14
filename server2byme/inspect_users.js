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

  // Inspect DentalNotes database users
  const db = client.db('DentalNotes');
  const users = await db.collection('User').find({}).toArray();
  console.log('--- USERS IN DentalNotes ---');
  console.log(users);

  // Inspect DentalNotesDemo database users
  const dbDemo = client.db('DentalNotesDemo');
  const usersDemo = await dbDemo.collection('User').find({}).toArray();
  console.log('\n--- USERS IN DentalNotesDemo ---');
  console.log(usersDemo);

  await client.close();
}

main().catch(console.error);
