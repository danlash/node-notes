var NodeNodes = (function(){

	var exports = {};

	exports.App = Backbone.Model.extend({
		start: function() {
			console.log('started')

			var notes = new List();
			var listView = new ListView({ collection : notes, el : $('#notes') });
			notes.fetch();

			this.notes=notes;
		}
	});


	var Note = Backbone.Model.extend({
		defaults: {
			"body" : "",
			"closed" : false
		}
	});

	var	List = Backbone.Collection.extend({
		model: Note,
		url: '/notes'
	});

	var ListView = Backbone.View.extend({
		initialize: function(){
			_.bindAll(this);
			this.collection.on("reset", this.render);
		},
		render: function(){
			var $notes = this.collection.map(function(note){
				return new NoteView({ model : note }).render().el;
			});

			this.$el.empty().append($notes);

			return this;
		}
	});

	var NoteView = Backbone.View.extend({
		tagName: "li",
		className: "note",
		initialize: function(){
			_.bindAll(this);
			this.template = _.template('\
				<form> \
	              <button class="btn btn-<%= buttonColor %> btn-mini"> \
	                <b class="icon-white icon-ok"></b> \
	              </button> \
	            </form> \
            	<%= Body %>');
		},
		render: function(){
			var viewModel = _.extend(this.model.toJSON(), {
				buttonColor: this.model.get('IsClosed') ? 'inverse' : 'primary'
			});
			this.$el.html(this.template(viewModel));

			return this;
		}
	});

	return exports;

})();