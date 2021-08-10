const gulp = require("gulp");
const clean = require("gulp-clean");
const sass = require("gulp-dart-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browsersync = require("browser-sync").create();
// const htmlPartial = require("gulp-html-partial");
// const fileinclude = require("gulp-file-include");
const include = require("gulp-html-tag-include");

const src = {
  sassPath: "sass/**/*.scss",
  htmlPath: "src/*.html",
  distPath: "css",
  htmlDistPath: "html",
  mapPath: ".",
};

gulp.task("html", function () {
  return gulp
    .src([src.htmlPath])
    .pipe(include())
    .pipe(gulp.dest(src.htmlDistPath));
});

// Compile SASS
gulp.task("sass", () => {
  return gulp
    .src(src.sassPath)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write(src.mapPath))
    .pipe(gulp.dest(src.distPath))
    .pipe(browsersync.reload({ stream: true }));
});

// Start App on Browser
gulp.task("browser-sync", () => {
  browsersync.init({
    server: "./",
    files: "./",
    watchEvents: ["add", "change"],
  });
});

// Detect Changes
gulp.task("watch", () => {
  gulp.watch(src.sassPath, gulp.series("sass"));
  gulp.watch(src.htmlPath, gulp.series("html"));
  gulp.watch("src/**/*.html").on("change", browsersync.reload);
  gulp.watch("src").on("add", function (path, stats) {
    gulp.series("html");
  });
});

// Run Gulp Magic
gulp.task(
  "default",
  gulp.series(gulp.parallel("sass", "html", "browser-sync", "watch"))
);
