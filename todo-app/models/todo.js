"use strict";
const { Model,Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    static async remove(ID) {
      this.destroy({ where: {
          id:ID,
        },
      });
    }

    static async dueToday(){
      return this.findAll({
        where:{
          [Op.and]:[{
            dueDate:{
              [Op.eq]:new Date(),
            },
            completed:false,
        }]
      },
      });
    }

    static async dueLater(){
      return this.findAll({
        where:{
          [Op.and]:[{
            dueDate:{
              [Op.gt]:new Date(),
            },
            completed:false,
        }]
      },
      });
    }

    static async overdue(){
      return this.findAll({
        where:{
          [Op.and]:[{
            dueDate:{
              [Op.lt]:new Date(),
            },
            completed:false,
        }]
      },
      });
    }

    static async completedItems(){
      return this.findAll({
        where:{
          completed:true,
        }
      })
    }

    static async deleteAll(){
      this.destroy({where:{}});
    }

    setCompletionStatus(state) {
      return this.update({completed:state});
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
