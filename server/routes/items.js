var express = require('express');
var router = express.Router();
var _ = require('lodash');
var multer = require('multer');
var path = require('path');
var logger = require('../lib/Logger');
var log = logger();

var items = require('../initial_data.json').data;
var curId = _.size(items);

// Configure multer for file uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

/* GET items listing. */
router.get('/', function (req, res) {
  res.json(_.toArray(items));
});

/* Create a new item with an image, name, title, and id */
router.post('/', upload.single('image'), function (req, res) {
  var item = req.body;
  if (req.file) {
    item.imageUrl = `/images/${req.file.filename}`;
  }
  curId += 1;
  item.id = curId;
  items[item.id] = item;
  log.info('Created item', item);
  res.json(item);
});

/* Get a specific item by id */
router.get('/:id', function (req, res, next) {
  var item = items[req.params.id];
  if (!item) {
    return next();
  }
  res.json(items[req.params.id]);
});

/* Delete a item by id */
router.delete('/:id', function (req, res) {
  var item = items[req.params.id];
  delete items[req.params.id];
  res.status(204);
  log.info('Deleted item', item);
  res.json(item);
});

/* Update an item by id with an image, name, title, and id */
router.put('/', upload.single('image'), function (req, res, next) {
  var item = req.body;
  const id = req.body.id;
  if (item.id != id) {
    return next(new Error('ID parameter does not match body'));
  }
  if (req.file) {
    item.imageUrl = `/images/${req.file.filename}`;
  }
  items[item.id] = item;
  log.info('Updating item', item);
  res.json(item);
});

module.exports = router;
