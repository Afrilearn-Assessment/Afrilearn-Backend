'use strict';
const {
  Model
} = require('sequelize');
const PROTECTED_ATTRIBUTES = ['password'];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      const attributes = Object.assign({}, this.get());
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    country: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};