const seedPosts = require("./postSeeds");
const seedUsers = require("./userSeeds");
const seedComments = require("./commentSeeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log(" Database Synced!");
  await seedUsers();
  console.log("Users Seeded!");
  await seedPosts();
  console.log("Posts Seeded!");
  await seedComments();
  console.log("Comments Seeded!");
  process.exit(0);
};

seedAll();
