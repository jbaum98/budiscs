Router.map(function () {
  this.route('index', {
      path: '/',
      template: 'index',
      layoutTemplate: 'layout'
  });
  
  this.route('about', {
      //layoutTemplate:'layout'
  })
});