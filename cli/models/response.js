"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    static error(error) {
        const res = new Response();
        res.success = false;
        if (typeof (error) === 'string') {
            res.message = error;
        }
        else {
            res.message = error.message != null ? error.message : error.toString();
        }
        return res;
    }
    static notFound() {
        return Response.error('Not found.');
    }
    static badRequest(message) {
        return Response.error(message);
    }
    static multipleResults(ids) {
        let msg = 'More than one result was found. Try getting a specific object by `id` instead. ' +
            'The following objects were found:';
        ids.forEach((id) => {
            msg += '\n' + id;
        });
        return Response.error(msg);
    }
    static success(data) {
        const res = new Response();
        res.success = true;
        res.data = data;
        return res;
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map