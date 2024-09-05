const { User } = require("../models");

const userData = [
  {
    username: "Chris Natale",
    password: "password123",
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
