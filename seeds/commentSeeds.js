const { Comment } = require("../models");

const commentData = [
  {
    userId: 1,
    postId: 1,
    comment: "Great post!",
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
