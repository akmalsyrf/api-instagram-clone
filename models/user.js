'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.post, {
        foreignKey: {
          name: 'user_id',
        }
      })
      user.hasMany(models.chat, {
        as: 'senderMessage',
        foreignKey: {
          name: 'id_sender',
        }
      })
      user.hasMany(models.chat, {
        as: 'recipientMessage',
        foreignKey: {
          name: 'id_recipient',
        }
      })
    }
  }
  user.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    email_verified_at: DataTypes.DATE,
    password: DataTypes.STRING,
    images_profile: DataTypes.STRING,
    fb_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};