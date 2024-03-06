const Sequelize = require("sequelize");

const sequelize = new Sequelize("blog", "root", "kzh162", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
