const { Model, DataTypes } = require("sequelize");
const sequelize = require("../services/databaseConnection.js");

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
  }
);

module.exports = Category;