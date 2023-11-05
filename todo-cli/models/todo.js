'use strict';
const {
  Op,
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const Itemoverdue=await this.overdue();
      const list=Itemoverdue.map((item)=>item.displayableString());
      console.log(list.join("\n"));
      console.log("\n");

      console.log("Due Today");
      const Itemtoday=await this.dueToday();
      const list1=Itemtoday.map((item)=>item.displayableString());
      console.log(list1.join("\n"));
      console.log("\n");

      console.log("Due Later");
      const later=await this.dueLater();
      const list2=later.map((item)=>item.displayableString());
      console.log(list2.join("\n"));
    }

    static async overdue() {
      return await Todo.findAll({
        where:{
          dueDate:{
            [Op.lt]: new Date(),
          },
        },
        order: [["id","ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where:{
          dueDate:{
            [Op.eq]: new Date(),
          },
        },
        order: [["id","ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where:{
          dueDate:{
            [Op.gt]: new Date(),
          },
        },
        order: [["id","ASC"]],
      });
    }

    static async markAsComplete(id) {
      await Todo.update({
        completed:true
      },
      {
        where:{
          id: id,
        },
      }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const date=new Date(this.dueDate);
      return date.getDate()===new Date().getDate()? `${this.id}. ${checkbox} ${this.title}` : `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};