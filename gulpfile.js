const gulp = require('gulp');
const ejs = require('gulp-ejs');
const connect = require('gulp-connect');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer')
const imagemin = require('gulp-imagemin');
// sass.compiler = require("node-sass");


function html(done) {
    gulp.src("./src/html/templates/*.ejs")
        .pipe(ejs().on("error", (err) => { console.log(err); }))
        .pipe(rename(function(path) {
            if(path.basename !== "index") {
                path.dirname = path.basename;
                path.basename = "index";
            }

            path.extname = ".html";
        }))
        .pipe(gulp.dest("./dist/"))
        .pipe(connect.reload());

    done();
}

function images(done) {
    gulp.src("./src/images/**/*.*")
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/assets/images/"))
        .pipe(connect.reload());

    done();
}

function css(done) {
    gulp.src("./src/css/main.css")
        .pipe(postcss([
            require('tailwindcss'),
            require('autoprefixer'),
            require('postcss-import'),
          
         ]))
    
        .pipe(gulp.dest("./dist/assets/css"))
        .pipe(connect.reload());

    done();
}

function js(done) {
    gulp.src("./src/js/**/*.js")
        /*.pipe(babel({
            presets: ['@babel/env']
        }).on("error", err => console.log(err)))*/
        .pipe(gulp.dest("./dist/assets/js"))
        .pipe(connect.reload());

    done();
}



function json(done) {
    gulp.src("./src/json/*.json")
        .pipe(gulp.dest("./dist/data"))
        .pipe(connect.reload());

    done();
}

// Watchers
function watchHtml() {
    gulp.watch("./src/html/**/*.ejs", { ignoreInitial: false }, html);
}

function watchImages() {
    gulp.watch("./src/images/**/*.*", { ignoreInitial: false }, images);
}

function watchCss() {
    gulp.watch("./src/css/**/*.css", { ignoreInitial: false }, css);
    gulp.watch('./tailwind.config.js', css);
}

function watchJs() {
    gulp.watch("./src/js/**/*.js", { ignoreInitial: false }, js);
}


function watchJson() {
    gulp.watch("./src/json/*.json", { ignoreInitial: false }, json);
}

gulp.task("dev", function(done) {
    watchHtml();
    watchImages();
    watchCss();
    watchJs();
  
    watchJson();
    connect.server({
        livereload: true,
        root: "dist"
    });

    done();
});

gulp.task("build", function(done) {
    js(done);
    json(done);
    css(done);
    images(done);

    html(done);
    
    done();
});