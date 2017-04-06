// ストリクトモードにし、犯しがちなミスをエラーにしたり、予約語の仕様を制限する（ファイルの冒頭か関数の冒頭で宣言することで有効になる）
'use strict'
// gulpプラグインの読み込み(require:外部ファイルの読み込み)

/*-------------------
    グローバル変数
-------------------*/
// const:再代入不可能な変数を宣言する
// require():プラグインの読み込み
const gulp = require('gulp');
// gulp-plumber:Stream中に起こるエラーが原因でタスクが強制停止することを防止する
const plumber = require('gulp-plumber');
// gulp-sourcemaps:cssがどこのファイルから当てられてるのか分かるようにする
const sourcemaps = require('gulp-sourcemaps');

const developDir = './_src/';
const deployDir = './deploy/';
const imgDir = deployDir + 'images';
const config = {
    mapDir: '../_maps/',
    cssSrc: [developDir + 'sass/**/*.scss'],
    jsSrc: [developDir + 'scripts/**/*.js'],
    scriptName: 'main.js'
};

/*-----------------
    HTMLのタスク
------------------*/
// 「html」という名前のタスクを登録する
gulp.task('html', () => {
	// src:htmlファイルの読み出し
    gulp.src([developDir + './**/*.html'])
        // pipe:srcで取得したファイルに処理を施す
    	// dest:出力先に処理を施したファイルを出力
        .pipe(gulp.dest(deployDir));
});


/*-----------------
    CSSのタスク
------------------*/
// 変数
const sass = require('gulp-sass');
// gulp-autoprefixer:必要なベンダープレフィックスを自動で付与する
const autoprefixer = require('gulp-autoprefixer');
// 「css」という名前のタスクを登録する
gulp.task('css', () => {
    // コンパイル対象のsassファイルを指定
    gulp.src(config.cssSrc)
        // 各プラグインの処理を施す
        .pipe(plumber()) // 強制終了の防止
        .pipe(sourcemaps.init()) // どのファイルか分かるようにする
        .pipe(autoprefixer()) // ベンダープレフィックスの付与
        .pipe(sass({
            outputStyle: 'compressed' // CSSを1行にコンパイル
        }))
        .pipe(sourcemaps.write(config.mapDir)) // マップファイルを出力するパスを指定します
        .pipe(gulp.dest(deployDir + 'styles')); // コンパイル後のファイル出力先
});


/*--------------------
 JavaScriptSのタスク
 -------------------*/
// 変数
// gulp-concat:JSファイルを一つにまとまる
const concat = require('gulp-concat');
// gulp-uglify:JSを圧縮する
const uglify = require('gulp-uglify');
// 「js」という名前のタスクの登録
gulp.task('js', () => {
    gulp.src(config.jsSrc)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat(config.scriptName))
        .pipe(uglify())
        .pipe(sourcemaps.write(config.mapDir))
        .pipe(gulp.dest(deployDir + 'scripts'));
});


/*-------------
 画像のタスク
 ------------*/
// gulp-imagemin:画像を軽量化するプラグインの読み込み
const imagemin = require('gulp-imagemin');
// 「imgDir」という名前のタスクを登録
gulp.task('imagemin', () => {
    // imgDirフォルダー以下のpng画像を取得
    gulp.src(imgDir + '/**/*')
        .pipe(imagemin({ // 画像の圧縮処理を実行
            progressive: true,
            optimizationLevel: 7
        }))
        .pipe(gulp.dest(deployDir + 'images')); // deployDirフォルダー以下に保存
});


/*--------------------------------
 ブラウザのリロード自動化のタスク
 -------------------------------*/
// browser-sync:ブラウザのリロードを自動化する
const browserSync = require('browser-sync');
// 「browser-sync」という名前のタスクを登録
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: deployDir,
            index: 'index.html'
        }
    });
});


gulp.task('bs-reload', () => {
    browserSync.reload();
});

/*-------------
 監視のタスク
 ------------*/
gulp.task('watch', () => {
    gulp.watch(developDir + '**/*.html', ['html']);
    gulp.watch(config.jsSrc, ['js']);
    gulp.watch(config.cssSrc, ['css']);
});

gulp.task('watch-sync', () => {
    gulp.watch(developDir + '**/*.html', ['html', 'bs-reload']);
    gulp.watch(config.jsSrc, ['js', 'bs-reload']);
    gulp.watch(config.cssSrc, ['css', 'bs-reload']);
});

/*---------------------------------------
 ターミナルコマンドのタスク（まとめて）
 --------------------------------------*/
gulp.task('default', ['html', 'css', 'js', 'watch']); // 「gulp」コマンドを打った時
gulp.task('sync', ['html', 'css', 'js', 'browser-sync', 'watch-sync']); // 「sync」コマンドを打った時
gulp.task('release', ['html', 'css', 'js', 'imagemin']); // 「release」コマンドを打った時
