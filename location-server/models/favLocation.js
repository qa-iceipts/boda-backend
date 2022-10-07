'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class favloc extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    favloc.init({
        user_id: {
            type: DataTypes.STRING,
        },
        lat: {
            type: DataTypes.STRING
        },
        long: {
            type: DataTypes.STRING
        },
        type: DataTypes.ENUM("WORK", "HOME"),
    }, {
        // scopes
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
        scopes: {},
        sequelize,
        modelName: 'favloc',
    });
    return favloc;
};