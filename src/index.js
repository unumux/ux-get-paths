import path from "path";

import glob from "glob";
import _ from "lodash";

const DEFAULT_OPTIONS = {
    ignoreFolders: ["node_modules/**"]
};

function getPaths(ext, opts) {
    let options = Object.assign({}, DEFAULT_OPTIONS, opts);
    return new Promise(function(resolve, reject) {
        glob(`**/*.${ext}`, {
            ignore: options.ignoreFolders
        }, function(err, paths) {
            if(err) {
                reject(err);
            } else {
                let folderNames = _(paths).map(function(singlePath) {
                    return path.resolve(path.dirname(singlePath));
                }).uniq().value();

                resolve(folderNames);
            }
        });
    });
}

module.exports = getPaths;
