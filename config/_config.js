module.exports = {
  port: 3000,
  PATHS: {
    entry: {
      html: 'src/**.html',
      images: 'src/assets/images/**.*',
      less: 'src/assets/styles/less/**.less',
      css: 'src/assets/styles/css/**.css',
      js: 'src/assets/js/**.js',
      libs: 'src/assets/libs/**/**.*',
    },
    output: {
      dev: {
        html: '.tmp',
        images: '.tmp/assets/images',
        less: '.tmp/assets/styles/less',
        css: '.tmp/assets/styles/css',
        js: '.tmp/assets/js',
        libs: '.tmp/assets/libs',
      },
      pro: {
        html: 'dist',
        images: 'dist/assets/images',
        less: 'dist/assets/styles/less',
        css: 'dist/assets/styles/css',
        js: 'dist/assets/js',
        libs: 'dist/assets/libs',
      },
    },
  },
};
