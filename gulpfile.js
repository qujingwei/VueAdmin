var gulp = require('gulp');
var sftp = require('gulp-sftp');

const sftpOption = {
  host: '120.77.221.25',
  auth: 'riverwatcher',
  remotePath: '/data/www/wxhz.xtepa.com/',
}

gulp.task('upload', function () {
    return gulp.src('dist/**')
        .pipe(sftp(sftpOption));
});
