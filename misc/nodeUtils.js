"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class NodeUtils {
    static mkdirpSync(targetDir, mode = '700', relative = false, relativeDir = null) {
        const initialDir = path.isAbsolute(targetDir) ? path.sep : '';
        const baseDir = relative ? (relativeDir != null ? relativeDir : __dirname) : '.';
        targetDir.split(path.sep).reduce((parentDir, childDir) => {
            const dir = path.resolve(baseDir, parentDir, childDir);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, mode);
            }
            return dir;
        }, initialDir);
    }
}
exports.NodeUtils = NodeUtils;
//# sourceMappingURL=nodeUtils.js.map