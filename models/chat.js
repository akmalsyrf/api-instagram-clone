'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chat.init({
    message: DataTypes.TEXT,
    id_sender: DataTypes.INTEGER,
    id_recipient: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};