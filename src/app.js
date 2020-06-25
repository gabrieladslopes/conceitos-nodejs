const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

// Middlewares
function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  if (!repositories.find(repository => repository.id == id)) {
    return response.status(400).json({ error: `Repository with id ${id} does not exist.` });
  }

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id == id);

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repId = repositories.findIndex(repository => repository.id == id);

  repositories.splice(repId, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const rep = repositories.find(repository => repository.id == id);

  rep.likes += 1;

  return response.json(rep);
});

module.exports = app;
