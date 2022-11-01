'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ride_requests extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ride_requests.belongsTo(models.rides); // Adds fk to ride_requests
            ride_requests.belongsTo(models.users, { foreignKey: 'driver_id', as: 'driver' }); // Adds fk to ride_requests
        }
    };
    ride_requests.init({
        status: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
        price: DataTypes.DOUBLE,
        range: DataTypes.INTEGER,
        driverDuration: DataTypes.STRING,
        driverDistance: DataTypes.STRING,
        // quoteOption: DataTypes.ENUM('FIXED', 'NEGOTIABLE')
    }, {
        sequelize,
        modelName: 'ride_requests',
    });
    return ride_requests;
};