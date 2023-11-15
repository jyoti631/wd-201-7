
'use strict';
const {
  Op,
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * this method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User,{
        foreignKey:'userId'
      })
      // define association here
    }

    static addTodo({ title, dueDate,userId }) {
      return Todo.create({ title: title, dueDate: dueDate, completed: false ,userId:userId})
    }

    static async overdue(userId) {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          userId:userId,
          completed: false
        },
        order: [["id", "ASC"]],
      });
    }
    static async dueLater(userId) {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          userId:userId,
          completed: false
        }
      });
    }
    static dueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          userId:userId,
          completed: false

        },
        order: [["id", "ASC"]],
      });
    }
    static async completedItems(userId) {
      return await Todo.findAll({
        where: {
          completed: true,
          userId:userId,
        },
       
        order: [["id", "ASC"]],
      });
    }
    setCompletionStatus() {
      if (this.completed == true) {
        return this.update({ completed: false })
      }
      else if (this.completed == false) {
        return this.update({ completed: true })
      }
    }
  }
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        len:5,
        notNull:true
      }
    },
    dueDate: {type:DataTypes.DATEONLY,
      allowNull:false,
      validate: {
        notNull:true
      }},
    completed:{type: DataTypes.BOOLEAN}
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
