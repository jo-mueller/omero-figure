
// Various Backbone Views for rendering ROIs etc in a table view

/*global Backbone:true */

// Main manager of ROI views for table
var RoiTableViewManager = Backbone.View.extend({
    
    initialize: function(opts) {
        var model = this.model;
        this.model.on("sync", function() {
            model.each(function(roi, i){
                var view = new RoiTableView({model: roi});
                $("#roi_small_table").append(view.render().el);
            });
        });
        this.model.on("add", function(roi){
            var view = new RoiTableView({model: roi});
            $("#roi_small_table").append(view.render().el);
        });
    },
});

var RoiTableView = Backbone.View.extend({
    
    tagName: "tbody",

    //template: _.template($('#item-template').html()),
    
    // events: { },
    
    initialize: function() {
        this.model.on('change', this.render, this);
        
        this.$el = $("<tr></tr>").appendTo(this.$el);
        
        var self = this;
        // Add Views for any existing shapes models
        this.model.shapes.each(function(shape) {
            self.create_shape_view(shape);
        });
        
        // If a shape is added, Create View for that too
        this.model.shapes.on("add", function(shape) {
            self.create_shape_view(shape);
        });
    },
    
    render: function() {
      this.$el.html("<td>ROI " + this.model.get('id') + "</td>");
      return this;
    },
    
    create_shape_view: function(shape) {
        
        var view = new TableShapeView({model:shape});
        console.log( view.render().el, this.$el, this.$el.parent());
        this.$el.parent().append(view.render().el);
    }
});



var TableShapeView = Backbone.View.extend({
    tagName: "tr",
    
    initialize: function() {
        this.model.on('change', this.render, this);
    },
    
    render: function() {
        var text = "Shape " + this.model.get('id') + " " + this.model.get('type') + " theZ: " + this.model.get('theZ');
        if (this.model.get('x')) {
            text += " x:" + this.model.get('x');
            text += " y:" + this.model.get('y');
        }
        if (this.model.get('cx')) {
            text += " cx:" + this.model.get('cx');
            text += " cy:" + this.model.get('cy');
        }
      this.$el.html(text);
      return this;
    }
});