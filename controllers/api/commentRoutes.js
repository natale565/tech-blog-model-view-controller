const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Using the GET method to get all the comments ('api/comment')
router.get("/", async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll({});
    if (dbCommentData.length === 0) {
      res.status(404).json({ message: "You have no comment." });
      return;
    }
    res.status(200).json(dbCommentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Using the GET method to get all the comments from one post
router.get("/:id", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: { id: req.params.id },
    });
    if (commentData.length === 0) {
      res
        .status(404)
        .json({ message: `The id ${req.params.id} has no comment.` });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Using the POST method to create a comment ('/api/comment')
router.post("/", withAuth, async (req, res) => {
  const body = req.body;
  try {
    const newComment = await Comment.create({
      ...body,
      userId: req.session.userId,
    });
    res.status(200).json({ newComment, success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Using the DELETE method to delete a comment ('api/comment/:id')
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.destroy({
      where: { id: req.params.id },
    });
    if (!dbCommentData) {
      res.status(404).json({
        message: `No comment is found with id = ${req.params.id}`,
      });
      return;
    }
    res.status(200).json({ dbCommentData, success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
