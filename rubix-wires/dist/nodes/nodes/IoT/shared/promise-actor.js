"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromiseActor {
    constructor() {
        this.stack = Promise.resolve(null);
    }
    process(f) {
        const callback = () => f();
        this.stack = this.stack.then(callback, error => {
            console.log(error);
            return callback();
        });
        return Promise.resolve(this.stack);
    }
}
exports.singleton = new PromiseActor();
//# sourceMappingURL=promise-actor.js.map