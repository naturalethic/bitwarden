"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TreeNode {
    constructor(node, name, parent) {
        this.children = [];
        this.parent = parent;
        this.node = node;
        this.node.name = name;
    }
}
exports.TreeNode = TreeNode;
//# sourceMappingURL=treeNode.js.map