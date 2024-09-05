const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// GET method to get all of the users created
router.get("/", (req, res) => {
  User.findAll({
    attributes: {
      exclude: ["password"],
    },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET method to find a specific user
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: {
      exclude: ["password"],
    },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({
          message: "No user found with this id",
        });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Using POST method to sign up a user for the blog
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create(req.body);
    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res
        .status(201)
        .json({ message: `Account created for ${dbUserData.username}` });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Using POST method to login a already exisiting user
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: { username: req.body.username },
    });
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: `User id ${req.params.id} is not valid.` });
      return;
    }
    // Validating the password
    const pwValidated = await dbUserData.checkPassword(req.body.password);
    if (!pwValidated) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }
    // Starting the user session
    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.status(200).json({ message: "You are logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Using POST method to logout the user ('/api/user/logout')
router.post("/logout", withAuth, async (req, res) => {
  try {
    if (req.session.loggedIn) {
      const dbUserData = await req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  } catch {
    res.status(400).end();
  }
});

module.exports = router;
