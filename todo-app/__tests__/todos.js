const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index")
const app = require("../app")
let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};
describe("todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(2000, () => { });
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  })
  test("signup", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Testgsagjhsa",
      lastName: "User A",
      email: "usera@test.com",
      password: "123456789",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });
  test("respond with json at todos", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@test.com", "123456789");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post('/todos').send({
      'title': 'buy chocolate',
      'dueDate': new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken

    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@test.com", "123456789");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "buy icecream",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken
    });

    const a = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const b = JSON.parse(a.text);
    const lastItem = b.dueToday[b.dueToday.length - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent.put(`/todos/${lastItem.id}`).send({
      _csrf: csrfToken,
    });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Marks a todo with the given ID as incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@test.com", "123456789");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "buy icecream",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken
    });

    const a = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const b = JSON.parse(a.text);
    const lastItem = b.dueToday[b.dueToday.length - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent.put(`/todos/${lastItem.id}`).send({
      _csrf: csrfToken,
    });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markIncompleteResponse = await agent.put(`/todos/${lastItem.id}`).send({
      _csrf: csrfToken,
    });
    parsedResponse = JSON.parse(markIncompleteResponse.text);
    expect(parsedResponse.completed).toBe(false);

  });


  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@test.com", "123456789");
    // FILL IN YOUR CODE HERE
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const response = await agent.post('/todos').send({
      'title': 'drink',
      'dueDate': new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken

    });
    const a = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const b = JSON.parse(a.text);
    const lastItem = b.dueToday[b.dueToday.length - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);


    const deleteres = await agent.delete(`/todos/${lastItem.id}`).send({
      _csrf: csrfToken,
    });
    const c = JSON.parse(deleteres.text);
    expect(c).toBe(true);
  });

})