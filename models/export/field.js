"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fieldType_1 = require("../../enums/fieldType");
const fieldView_1 = require("../view/fieldView");
class Field {
    static template() {
        const req = new Field();
        req.name = 'Field name';
        req.value = 'Some value';
        req.type = fieldType_1.FieldType.Text;
        return req;
    }
    static toView(req, view = new fieldView_1.FieldView()) {
        view.type = req.type;
        view.value = req.value;
        view.name = req.name;
        return view;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.name = o.name;
        this.value = o.value;
        this.type = o.type;
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map