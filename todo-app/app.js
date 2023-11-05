const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path=require("path");
app.use(bodyParser.json());

app.set("view engine","ejs");

const formattedDate = d => {
  return d.toISOString().split("T")[0]
}

var dateToday = new Date()
const today = formattedDate(dateToday)
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
)
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
)

app.use(express.static(path.join(__dirname,'public')));

app.get("/",async function(request,response){
  Todo.deleteAll();
  Todo.addTodo({ title: 'Submit assignment', dueDate: yesterday, completed: false });
  Todo.addTodo({ title: 'Pay rent', dueDate: today, completed: true });
  Todo.addTodo({ title: 'Service Vehicle', dueDate: today, completed: false });
  Todo.addTodo({ title: 'File taxes', dueDate: tomorrow, completed: false });
  Todo.addTodo({ title: 'Pay electric bill', dueDate: tomorrow, completed: false });
  const allTodos=await Todo.getTodos();
  if(request.accepts("html")){
    response.render("index",{allTodos});
  }
  else{
    response.json({allTodos});
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
  const todo = await Todo.findAll();
  response.json(todo);
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
  Todo.destroy({
    where: {
       id: request.params.id //this will be your id that you want to delete
    }
  }).then(function(rowDeleted){
    console.log(rowDeleted); // rowDeleted will return number of rows deleted
   if(rowDeleted === 1){
      response.send(true);
    }
    else{
      response.send(false);
    }
  }, function(err){
    response.send(false);
  });
});

module.exports = app;
