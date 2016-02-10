require("babel-register");
require("babel-polyfill");

var gulp = require("gulp");

var eslint = require("gulp-eslint");

var babel = require("gulp-babel");
var mocha = require("gulp-mocha");

var istanbul = require("gulp-istanbul");
var isparta = require("isparta");

var src = ["src/**/*.js", "!src/**/*.test.js"];
var tests = "test/*.js";

var dest = "dist/";

gulp.task("build", function() {
    return gulp.src(src)
        .pipe(babel({
            presets: ["es2015", "stage-1"]
        }))
        .pipe(gulp.dest(dest));
});

gulp.task("coverage", function() {
    return gulp.src(src)
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task("mocha", function() {
    return gulp.src(tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds: {
                global: 90
            }
        })).once("error", function() {

        });
});

gulp.task("eslint", function() {
    return gulp.src(["src/**/*.js", "gulpfile.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("test", ["eslint", "coverage", "mocha"]);

gulp.task("default", ["build"], function() {
    gulp.watch(["src/**/*.js", tests], ["test", "build"]);
});
