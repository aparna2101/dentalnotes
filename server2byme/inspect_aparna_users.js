const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { MongoClient } = require('mongodb');

const url = 'mongodb://aparnachaurasia210103_db_user:DpIHSwSusS8lfyQe@ac-gxpxsky-shard-00-00.xi4hfsl.mongodb.net:27017,ac-gxpxsky-shard-00-01.xi4hfsl.mongodb.net:27017,ac-gxpxsky-shard-00-02.xi4hfsl.mongodb.net:27017/DentalNotes?ssl=true&replicaSet=atlas-y4r13g-shard-0&authSource=admin&appName=Cluster0';

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected!');

  const db = client.db('DentalNotes');
  const users = await db.collection('User').find({}).toArray();
  console.log('--- USERS IN APARNA CLUSTER ---');
  console.log(users);

  await client.close();
}

main().catch(console.error);
