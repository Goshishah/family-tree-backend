const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const baseModel = require("../utils/base.model");

const readDataFile = () => {
  const jsonPath = path.join(__dirname, "..", "data", "data.json");
  const rawdata = fs.readFileSync(jsonPath);
  return JSON.parse(rawdata);
};

const getTree = (req, res) => {
  try {
    const tree = readDataFile();
    const resultModel = baseModel({
      success: true,
      message: "tree fetched successfully.",
      data: tree,
    });
    res.status(200).json(resultModel);
  } catch (error) {
    console.log("API get-tree error", error);
    res.json(error);
  }
};

const postTree = (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "..", "data", "data.json");
    const node = req.body.node;
    const child = req.body.child;
    const tree = readDataFile();

    const newTree = addNodeInTree(node.attributes.id, tree, {
      name: node.name,
      attributes: {
        id: v4(),
      },
      children: child
        ? [
            ...node.children,
            {
              name: child.name,
              gender: child.gender || "male",
              attributes: {
                id: v4(),
              },
              children: [],
            },
          ]
        : [],
    });
    fs.writeFileSync(jsonPath, JSON.stringify(newTree));
    const data = readDataFile();
    const resultModel = baseModel({
      success: true,
      message: "tree saved successfully.",
      data,
    });
    res.status(200).json(resultModel);
  } catch (error) {
    console.log("API add tree node error", error);
    res.json(error);
  }
};

const deleteNode = (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "..", "data", "data.json");
    const node = req.body.node;
    const tree = readDataFile();

    if(tree.children.length < 1) {
      const resultModel = baseModel({
        success: false,
        message: "root not can'nt be delete.",
        data: tree,
      });
      return res.status(200).json(resultModel);
    }
    const newTree = deleteNodeFromTree(node.attributes.id, tree);
    fs.writeFileSync(jsonPath, JSON.stringify(newTree));
    const data = readDataFile();

    const resultModel = baseModel({
      success: true,
      message: "node deleted successfully.",
      data,
    });
    res.status(200).json(resultModel);
  } catch (error) {
    console.log("API register error", error);
    res.json(error);
  }
};

function deleteNodeFromTree(id, tree) {
  const queue = [];
  queue.unshift(tree);
  while (queue.length > 0) {
    const curNode = queue.pop();
    if (
      curNode.children.filter((item) => item.attributes.id === id).length > 0
    ) {
      curNode.children = curNode.children.filter(
        (item) => item.attributes.id !== id
      );
      return { ...tree };
    }
    const len = curNode.children.length;
    for (let i = 0; i < len; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
}

function addNodeInTree(id, tree, node) {
  const queue = [];
  queue.unshift(tree);
  while (queue.length > 0) {
    const curNode = queue.pop();
    if (curNode.attributes.id === id) {
      curNode.name = node.name;
      curNode.children = node.children ? node.children : curNode.children;
      return { ...tree };
    }

    const len = curNode.children.length;
    for (let i = 0; i < len; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
}

module.exports = {
  getTree,
  postTree,
  deleteNode,
};
