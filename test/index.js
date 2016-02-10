/*eslint-env node, mocha */

import path from "path";
import fs from "fs";

import {
    expect
} from "chai";
import sinon from "sinon";
import mock from "mock-fs";

import getPaths from "../src/index.js";

let getRelativePaths = async function(ext) {
    let paths = (await getPaths(ext)).map(function(absPath) {
        return path.relative("./", absPath);
    });
    return paths;
};

describe("getPaths()", function() {
    beforeEach(function() {
        // create a sandbox
        this.sandbox = sinon.sandbox.create();

        // create a mock filesystem
        mock({
            "folder1": {
                "test.js": "Test"
            },
            "folder2": {
                "test2.js": "Test",
                "test.scss": "Test"
            },
            "folder3": {
                "test.scss": "Test"
            },
            "node_modules": {
                "folder1": {
                    "test.js": "Test",
                    "test.scss": "Test"
                },
                "index.js": "Test"
            }
        });
    });

    afterEach(function() {
        // restore the environment as it was before
        this.sandbox.restore();

        mock.restore();
    });

    it("should return only folders containing files with the specified extension", async function() {
        let paths = getRelativePaths("js");
        expect(await paths).to.eql(["folder1", "folder2"]);

        paths = getRelativePaths("scss");
        expect(await paths).to.eql(["folder2", "folder3"]);
    });

    it("should return an empty array if the extension was not found", async function() {
        let paths = getRelativePaths("nope");
        expect(await paths).to.eql([]);
    });

    it("should properly handle an error", async function() {
        // spy on readdir calls
        this.stub = this.sandbox.stub(fs, "readdir", function(path, cb) {
            process.nextTick(function() {
                cb(new Error("mock failure"));
            });
        });

        try {
            getRelativePaths("js");
        } catch (e) {
            expect(e).to.equal("mock failure");
        }
    });

});
