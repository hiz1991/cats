const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("../db.json");
const middlewares = jsonServer.defaults();
const fs = require("fs");

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/cats", (req: any, res: any) => {
  console.log(req.query);
  const dbRaw = fs.readFileSync("./db.json", 'utf-8');

  const { breed, city, q } = req.query;

  const data = JSON.parse(dbRaw).cats;

  const result = data.filter((cat: Record<string, any>) => !city || city === cat.city)
    .filter((cat: Record<string, any>) =>
      !breed || (breed instanceof Array ? breed.includes(cat.breed) : breed === cat.breed))
    .filter((cat: Record<string, any>) => !q || cat.name.toLowerCase().includes(q.toLowerCase()))

  res.send(result);
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});
