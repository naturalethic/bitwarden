"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const folderView_1 = require("../view/folderView");
class Folder {
    static template() {
        const req = new Folder();
        req.name = 'Folder name';
        return req;
    }
    static toView(req, view = new folderView_1.FolderView()) {
        view.name = req.name;
        return view;
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.name = o.name;
    }
}
exports.Folder = Folder;
//# sourceMappingURL=folder.js.map