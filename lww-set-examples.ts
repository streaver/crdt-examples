import LWWSet from './LWWSet';

(async function () {
  const client1 = new LWWSet<string>();
  const client2 = new LWWSet<string>();

  client1.add('hola');

  await new Promise((r) => setTimeout(r, 50));

  client1.add('chau');

  await new Promise((r) => setTimeout(r, 50));

  client2.remove('chau');

  await new Promise((r) => setTimeout(r, 50));

  client2.add('chau');

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
})();
