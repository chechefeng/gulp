var gulp = require('gulp');
less = require('gulp-less');
minifycss = require('gulp-minify-css'), //css压缩
    concat = require('gulp-concat'), //合并文件
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //文件重命名
    notify = require('gulp-notify');
htmlmin = require('gulp-htmlmin');
imgmin = require("gulp-imagemin");
pngquant = require('imagemin-pngquant');
spritesmith = require("gulp.spritesmith");
rev = require('gulp-rev-append'); //基本使用(给页面引用url添加版本号,以清除页面缓存)
autoprefixer = require("gulp-autoprefixer") //自动添加前缀
livereload = require('gulp-livereload'); //当监听文件发生变化时，浏览器自动刷新页面

//处理less
gulp.task('testLess', function() {
    // 将你的默认的任务代码放在这
    gulp.src('src/less/index.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());

});
//压缩js
gulp.task("minJS", function() {
    gulp.src(['src/js/*.js', '!src/js/*.min.js'])
        .pipe(concat("index.js"))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest("src/js"))


    .pipe(gulp.dest('dist/js'))
        //.pipe(notify({message:"js task ok"}));

});
//压缩html
gulp.task("htmlmin", function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src("src/index.html")
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
});
//压缩图片
gulp.task("imgmin", function() {
    gulp.src("src/img/*.png")
        .pipe(imgmin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest("dist/img"))
        .pipe(gulp.dest("src/img"))


});
//雪碧图
gulp.task("spritimg", function() {
    gulp.src("src/img/*.png")
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }))
        .pipe(gulp.dest("dist/img1"))
        .pipe(gulp.dest("src/img"))

});
//给页面引用url添加版本号,以清除页面缓存
gulp.task('testRev', function() {
    gulp.src('src/index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist'));
    .pipe(gulp.dest('src'));
});
//自动加前缀
gulp.task("testAutoFx", function() {
    gulp.src("src/less/index.less")
        .pipe(less()) //less处理成css
        .pipe(autoprefixer({
            //browsers的参数
            // last 2 versions: 主流浏览器的最新两个版本
            //  last 1 Chrome versions: 谷歌浏览器的最新版本
            //  last 2 Explorer versions: IE的最新两个版本
            //  last 3 Safari versions: 苹果浏览器最新三个版本
            //  Firefox >= 20: 火狐浏览器的版本大于或等于20
            //  iOS 7: IOS7版本
            //  Firefox ESR: 最新ESR版本的火狐
            //  > 5%: 全球统计有超过5%的使用率
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        })) //添加前缀
        //.pipe(gulp.dest("dist/css")) //输出
        .pipe(gulp.dest('src'));
});
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/less/*.less', ['testLess']);
});
gulp.task('default', ['testLess', "minJS", "htmlmin",
    'imgmin', 'spritimg', 'testRev', "testAutoFx"
]);