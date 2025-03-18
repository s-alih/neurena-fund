"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiService {
    constructor() {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("GOOGLE_API_KEY is not set in environment variables");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    generateResponseStream(prompt_1) {
        return __asyncGenerator(this, arguments, function* generateResponseStream_1(prompt, context = "") {
            var _a, e_1, _b, _c;
            try {
                const fullPrompt = context ? `${context}\n\nUser: ${prompt}` : prompt;
                const result = yield __await(this.model.generateContentStream(fullPrompt));
                try {
                    for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const chunk = _c;
                        const chunkText = chunk.text();
                        if (chunkText) {
                            yield yield __await(chunkText);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                console.error("Error generating response:", error);
                throw error;
            }
        });
    }
}
exports.GeminiService = GeminiService;
