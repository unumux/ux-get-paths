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
            if (err) {
                reject(err);
            } else {
                let folderNames = _(paths).map(function(singlePath) {
                    return path.dirname(singlePath);
                }).uniq().value();

                folderNames = mergeCommonFolders(folderNames);

                resolve(folderNames);
            }
        });
    });
}

function mergeCommonFolders(paths) {
    paths = paths.map(function(singlePath) {
        return singlePath.split("/");
    });


    var newPaths = paths.map(function(value, i) {
        var commonPath = _.filter(value, function(part, j) {
            var partsAtIndex = paths.map(function(value, k) {
                if (i === k) {
                    return undefined;
                }

                return value[j];
            });

            return partsAtIndex.indexOf(part) >= 0;

        });

        if (commonPath.length === 0) {
            return value;
        }

        return commonPath;

    });

    newPaths = _.uniqWith(newPaths, _.isEqual);
    newPaths = newPaths.map(function(newPath) {
        return newPath.join("/");
    });


    return newPaths;
}

module.exports = getPaths;
