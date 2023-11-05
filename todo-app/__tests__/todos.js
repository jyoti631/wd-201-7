const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
var cheerio = require("cheerio");

let server, agent;
function extractCsrfToken(res){
  var $= cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res= await agent.get("/");
    const csrfToken=extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res= await agent.get("/");
    let csrfToken=extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    const groupedTodosResponse =await agent.get("/").set("Accept","application/json");
    const parsedGroupedResponse=JSON.parse(groupedTodosResponse.text);
    const dueTodayCount=parsedGroupedResponse.dueToday.length;
    const latestTodo=parsedGroupedResponse.dueToday[dueTodayCount-1];
    res=await agent.get("/");
    csrfToken=extractCsrfToken(res);
    const markCompleteResponse=await agent.put(`/todos/${latestTodo.id}`).send({
      completed:latestTodo.completed,
      _csrf:csrfToken,
    });
    const parsedmarkCompleteResponse=JSON.parse(markCompleteResponse.text);
    expect(parsedmarkCompleteResponse.completed).toBe(true);
  });

  test("Mark a completed todo with the given ID as incomplete",async()=>{
    let res=await agent.get("/");
    let csrf=extractCsrfToken(res);
    await agent.post("/todo").send({
      title:"Complete DAA lab assignment",
      dueDate: new Date().toISOString(),
      completed: true,
      "_csrf":csrf
    });
    const groupedTodosResponse =await agent.get("/").set("Accept","application/json");
    const parsedGroupedResponse=JSON.parse(groupedTodosResponse.text);
    const completedItemsCount=parsedGroupedResponse.completedItems.length;
    const latestTodo=parsedGroupedResponse.completedItems[completedItemsCount-1];
    res=await agent.get("/");
    csrfToken=extractCsrfToken(res);
    const markIncompleteResponse=await agent.put(`/todos/${latestTodo.id}`).send({
      completed:latestTodo.completed,
      _csrf:csrfToken,
    });
    const parsedmarkIncompleteResponse=JSON.parse(markIncompleteResponse.text);
    expect(parsedmarkIncompleteResponse.completed).toBe(false);
  });

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const response = await agent.get("/todos");
  //   const parsedResponse = JSON.parse(response.text);

  //   expect(parsedResponse.length).toBe(4);
  //   expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    // FILL IN YOUR CODE HERE
    let res= await agent.get("/");
    let csrfToken=extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    const groupedTodosResponse =await agent.get("/").set("Accept","application/json");
    const parsedGroupedResponse=JSON.parse(groupedTodosResponse.text);
    const dueTodayCount=parsedGroupedResponse.dueToday.length;
    const latestTodo=parsedGroupedResponse.dueToday[dueTodayCount-1];
    res=await agent.get("/");
    csrfToken=extractCsrfToken(res);
    const deleteResponse=await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf:csrfToken,
    });
    const parseddeleteResponse=JSON.parse(deleteResponse.text);
    expect(parseddeleteResponse.success).toBe(true);
  });
});
