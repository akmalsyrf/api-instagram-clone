'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      post.hasMany(models.liker, {
        foreignKey: {
          name: 'post_id',
        }
      })
      post.hasMany(models.comment, {
        foreignKey: {
          name: 'post_id',
        }
      })
      post.belongsTo(models.user, {
        foreignKey: {
          name: 'user_id',
        }
      })
    }
  }
  post.init({
    imageurl: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    caption: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'post',
    charset: 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_unicode_ci'
    }
  });
  return post;
};