import GSet from './GSet';

const NUMBER_OF_CLIENTS = 5;

const client1 = new GSet<string>();
const client2 = new GSet<string>();

client1.add('element_4');
client2.add('element_3');
client2.add('element_1');
client1.add('element_2');
client1.add('element_1');

console.log({
  client1: client1.query(),
  client2: client2.query(),
});

const clients = [client1, client2];

clients.forEach((client) => {
  client1.merge(client);
  client2.merge(client);
});

console.log({
  client1: client1.query(),
  client2: client2.query(),
});
