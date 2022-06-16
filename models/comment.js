'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.user, {
        foreignKey: {
          name: "user_id",
        }
      })
      comment.belongsTo(models.post, {
        foreignKey: {
          name: "post_id",
        }
      })
    }
  }
  comment.init({
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};