/*eslint-env node, mocha */

import fs from "fs";

import {
    expect
} from "chai";
import sinon from "sinon";
import mock from "mock-fs";

import getPaths from "../src/index.js";

describe("getPaths()", function() {
    describe("folder structure 1", function() {
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
            let paths = getPaths("js");
            expect(await paths).to.eql(["folder1", "folder2"]);

            paths = getPaths("scss");
            expect(await paths).to.eql(["folder2", "folder3"]);
        });

        it("should return an empty array if the extension was not found", async function() {
            let paths = getPaths("nope");
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
                getPaths("js");
            } catch (e) {
                expect(e).to.equal("mock failure");
            }
        });
    });

    describe("folder structure 2", function() {
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
                "folder4": {
                    "folder4-1": {
                        "test.scss": "Test"
                    },
                    "folder4-2": {
                        "test.scss": "Test"
                    },
                    "folder4-3": {
                        "test.js": "Test"
                    }
                },
                "folder5": {
                    "folder5-1": {
                        "test.scss": "Test"
                    },
                    "folder5-2": {
                        "test.js": "Test"
                    }
                },
                "folder6": {
                    "folder6-1": {
                        "folder6-1-1": {
                            "test.scss": "Test"
                        },
                        "folder6-1-2": {
                            "test.scss": "Test"
                        }
                    },
                    "folder6-2": {
                        "folder6-2-1": {
                            "test.js": "Test"
                        }
                    }
                },
                "node_modules": {
                    "folder1": {
                        "test.js": "Test",
                        "test.scss": "Test"
                    },
                    "index.js": "Test"
                },
                "test.scss": "Test"
            });
        });

        afterEach(function() {
            // restore the environment as it was before
            this.sandbox.restore();

            mock.restore();
        });

        it("should return the lowest common folder", async function() {
            let paths = getPaths("scss");
            expect(await paths).to.eql(["folder2", "folder3", "folder4", "folder5/folder5-1", "folder6/folder6-1", "."]);
        });
    });
});
