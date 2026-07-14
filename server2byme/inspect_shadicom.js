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
  console.log('Connected to MongoDB!');

  const db = client.db('SHADICOM');
  const subjects = await db.collection('Subject').find({}).toArray();
  const chapters = await db.collection('Chapter').find({}).toArray();

  console.log('--- SUBJECTS IN SHADICOM ---');
  subjects.forEach(s => console.log(s));

  console.log('\n--- CHAPTERS IN SHADICOM ---');
  chapters.forEach(c => console.log(c));

  await client.close();
}

main().catch(console.error);
