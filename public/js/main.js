'use strict';

require.config({
  shim: {
    'bootstrap': {
      deps: [
        'jquery'
      ],
      exports: 'jquery'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: [
        'jquery',
        'underscore'
      ],
      exports: 'Backbone'
    },
    'backbone-relational': ['backbone']
  },
  paths: {
    'jquery': '/js/components/jquery/jquery',
    'bootstrap': '/js/components/sass-bootstrap/docs/assets/js/bootstrap',
    'underscore': '/js/components/underscore/underscore',
    'backbone': '/js/components/backbone/backbone'
  }
});

requirejs(['backbone', 'jquery', 'underscore'], function (Backbone, $, _) {

  var RCharts = {};

  RCharts.Router = Backbone.Router.extend({
    initialize: function(options) {
      this.main = options.container;
      this.sidebar = options.sidebar;
      this.charts = new RCharts.Charts().fetch().then(function(charts) {
        options.sidebar.replaceWith(new RCharts.SidebarView({charts:charts}).render().el);
      });
    },
    routes: {
      '': 'index',
      'r/:chart': 'chart'
    },
    index: function() {
      this.navigate('r/Music');
    },
    chart: function(chart) {
      console.log('Chart: ' + chart);
      var _this = this;
      new RCharts.Chart({ id: chart }).fetch().then(function(chart) {
        var view = new RCharts.ChartView({
          chart: chart
        });
        _this.main.replaceWith(view.render().el);
      });
    }
  });

  RCharts.Chart = Backbone.Model.extend({
    urlRoot: '/r',
    url: function() {
      return this.urlRoot + '/' + this.id + '.json';
    },
    parse: function(body) {
      return body.results;
    }
  });

  RCharts.Charts = Backbone.Collection.extend({
    model: RCharts.Chart,
    url: '/subreddits.json'
  });

  RCharts.SidebarView = Backbone.View.extend({
    initialize: function(options) {
      this.charts = options.charts;
    },
    className: 'sidebar',
    template: $('#template-sidebar').html(),
    render: function() {
      console.log('Render Sidebar');
      this.$el.html(_.template(this.template, this));
      return this;
    }
  });

  RCharts.ChartView = Backbone.View.extend({
    className: 'main',
    initialize: function(options) {
      this.chart = options.chart;
    },
    template: $('#template-chart').html(),
    render: function() {
      console.log('Render Chart');
      this.$el.html(_.template(this.template, this.chart));
      return this;
    }
  });

  RCharts.boot = function(container, sidebar) {
    container = $(container);
    sidebar = $(sidebar);
    return new RCharts.Router({
      container: container,
      sidebar: sidebar
    });
  };

  RCharts.boot('.main', '.sidebar');
  Backbone.history.start({
    pushState: true
  });

});