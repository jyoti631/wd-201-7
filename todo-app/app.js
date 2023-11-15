var csrf = require("csurf");
const express = require('express');
const app = express();
const { Todo } = require('./models');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser("ssh! some secret string"));
app.use(csrf({ cookie: true }))

app.set("view engine", "ejs");
app.get("/", async (reqest, response) => {

    const overdue = await Todo.overdue();
    const dueLater = await Todo.dueLater();
    const dueToday = await Todo.dueToday();
    const completedItems = await Todo.completedItems();
    if (reqest.accepts("html")) {
        response.render('index', {

            overdue,
            dueLater,
            dueToday,
            completedItems,
            csrfToken: reqest.csrfToken()

        });
    }
    else {
        response.json({
            overdue,
            dueLater,
            dueToday,
            completedItems,
        })
    }
});

app.use(express.static(path.join(__dirname, 'public')))
//middileware
app.post("/todos", async (request, response) => {
    try {
        console.log("creating a todo", request.body)
        const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate, completed: false });
        return response.redirect("/")

    } catch (error) {
        console.log(error);
        return response.status(422).json(error)
    }
});

app.put("/todos/:id", async (request, response) => {

    const todo = await Todo.findByPk(request.params.id);
    console.log(request.params.id)
    try {

        const updatetodo = await todo.setCompletionStatus();
        return response.json(updatetodo)

    } catch (error) {
        console.log(error);
        return response.status(422).json(error)
    }
});
app.get("/todos", async (request, response) => {

    const todo = await Todo.findAll();
    try {

        return response.json(todo)

    } catch (error) {
        console.log(error);
        return response.status(422).json(error)
    }
});
app.delete("/todos/:id", async (request, response) => {


    try {

        const deleted = await Todo.destroy({
            where: {
                id: request.params.id
            },

        });
        response.send(deleted ? true : false);

    } catch (error) {
        response.send(false)
        return response.status(422).json(error)
    }
});



module.exports = app;
