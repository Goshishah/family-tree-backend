
const router = require("express").Router(),
  route = require("./route.name"),
  treeController = require("../controllers/app.tree.controller");

//default route
router.get(route.default, (req, res) => {
  res.send("default");
});

router.use(route.getTree, treeController.getTree);
router.use(route.postTree, treeController.postTree);
router.use(route.deleteNode, treeController.deleteNode);

// 404 not found route
router.use((req, res) => {
  res.status(404);
  res.send("404 not found");
});

module.exports = router;
