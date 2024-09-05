const { Post } = require("../models");

const postData = [
  {
    title: "My First Post",
    content: "This is my very first blog post!",
  },
];

module.exports = postData;
const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
