// Configuration for compiling browserify projects

var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");

var paths = {
  pages: ["src/*.html"]
};

var config = {
  basedir: ".",
  debug: true,
  entries: ["src/main.ts"],
  cache: {},
  packageCache: {}
};

var watchedBrowserify = watchify(browserify(config).plugin(tsify));

gulp.task("copy-html", function() {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

gulp.task("watch", gulp.series(gulp.parallel("copy-html", bundle)));

gulp.task(
  "uglify",
  gulp.series(
    gulp.parallel("copy-html", function() {
      return browserify(config)
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
    })
  )
);

gulp.task(
  "default",
  gulp.series(
    gulp.parallel("copy-html", function() {
      return browserify(config)
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist"));
    })
  )
);

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
