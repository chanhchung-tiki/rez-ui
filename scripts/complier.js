const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')

const isProduction = process.env.NODE_ENV === 'production'
let dist = path.join(__dirname, '..', 'es')
const basePath = path.join(__dirname, '..', 'src')
const extTypes = ['js', 'tcss', 'json', 'txml', 'sjs']

const argv = process.argv.slice(2)
const indexOutdir = argv.findIndex((item) => item === '--out-dir')

// Server for development process
if (!isProduction && indexOutdir !== -1) {
  dist = argv[indexOutdir + 1]
}

console.log({argv, dist})

gulp.task('js', () => {
  return gulp
    .src(`${basePath}/**/*.js`)
    .pipe(babel())
    .on('error', (err) => console.log({err}))
    .pipe(gulp.dest(dist))
})

gulp.task('tcss', () => {
  return gulp.src(`${basePath}/**/*.tcss`).pipe(gulp.dest(dist))
})

gulp.task('json', () => {
  return gulp.src(`${basePath}/**/*.json`).pipe(gulp.dest(dist))
})

gulp.task('txml', () => {
  return gulp.src(`${basePath}/**/*.txml`).pipe(gulp.dest(dist))
})

gulp.task('sjs', () => {
  return gulp.src(`${basePath}/**/*.sjs`).pipe(gulp.dest(dist))
})

const build = gulp.series(...extTypes)
build()

if (!isProduction) {
  extTypes.forEach((type) => {
    const watcher = gulp.watch(`${basePath}/**/*.${type}`, gulp.series(type))

    watcher.on('change', function (path) {
      console.log(`File ${path} was changed`)
    })

    watcher.on('add', function (path) {
      console.log(`File ${path} was added`)
    })

    watcher.on('unlink', function (path) {
      console.log(`File ${path} was removed`)
    })
  })
}
