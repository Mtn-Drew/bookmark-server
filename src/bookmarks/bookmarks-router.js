const express = require("express");
const uuid = require("uuid/v4");
const logger = require("../logger");
const store = require("../store");
const bodyParser = express.json();

const bookmarksRouter = express.Router();

bookmarksRouter.get("/", (req, res) => {
  res.send("Hello, bookmarks!");
});

bookmarksRouter
  .route("/bookmarks")
  .get((req, res) => {
    console.log("in get bookmarks");
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;
    if (!title) {
      logger.error(`title is required`);
      return res.status(400).send("Invalid data");
    }
    if (!url) {
      logger.error(`url is required`);
      return res.status(400).send("Invalid data");
    }
    if (!description) {
      logger.error(`description is required`);
      return res.status(400).send("Invalid data");
    }
    if (!rating) {
      logger.error(`rating is required`);
      return res.status(400).send("Invalid data");
    }

    // get an id
    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    };
    store.bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} has been created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route("/bookmarks/:bookmark_id")
  .get((req, res) => {
    const { bookmark_id } = req.params;
    console.log(bookmark_id);
    console.log("is bookmark");
    const bookmark = store.bookmarks.find(c => c.id === bookmark_id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Bookmark Not Found");
    }

    res.json(bookmark);
    console.log("get me");
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;

    const bookmarkIndex = store.bookmarks.findIndex(c => c.id == bookmark_id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Not found");
    }
    store.bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${bookmark_id} has been deleted`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
