var NodeNodes = (function(){

	var exports = {};

	exports.App = Backbone.Model.extend({
		start: function() {
			var list = new List({ id: 2, name : 'Vacation Days' });
			var listView = new ListView({ model : list, el : $('#list') });

			var setupAutoSave = function () {
				list.on('change', function(){
					Backbone.sync('update', list);
				});	
			};

			list.fetch({ success: setupAutoSave });


			this.list=list;
		}
	});


	var Note = Backbone.Model.extend({
		defaults: {
			"body" : "",
			"closed" : false
		},
		close: function() {
			this.set('closed', true)
		},
		open: function() {
			this.set('closed', false)
		}
	});

	var	Notes = Backbone.Collection.extend({
		model: Note,
	});

	var List = Backbone.Model.extend({
		url: function () { return '/list/' + this.id; },
		initialize: function() {
		},
		parse: function(json) {
			json.notes = new Notes( json.notes );
			var _list = this;
			json.notes.on('change', function() {
				_list.trigger('change');
			});
			return json;
		}
	});

	var ListView = Backbone.View.extend({
		initialize: function () {
			_.bindAll(this);
			this.model.on('change', this.render);
		},
		render: function() {
			var notesView = new NotesView({ collection : this.model.get('notes'), el : $('#notes') });
			notesView.render();

			return this;
		}
	});

	var NotesView = Backbone.View.extend({
		initialize: function(){
			_.bindAll(this);
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
		events: {
			'click .close-note' : "close",
			'click .open-note' : "open"
		},
		initialize: function(){
			_.bindAll(this);
			this.model.on('change', this.render);
			this.template = _.template('\
				<form> \
	              <button class="close-note btn btn-primary btn-mini"> \
	                <b class="icon-white icon-ok"></b> \
	              </button> \
	              <button class="open-note btn btn-inverse btn-mini"> \
	                <b class="icon-white icon-check"></b> \
	              </button> \
	            </form> \
            	<%= body %>');
		},
		render: function(){
			var closed = this.model.get('closed');
			var viewModel = _.extend(this.model.toJSON(), {
				buttonColor: closed ? 'inverse' : 'primary',
				icon: closed ? 'check' : 'ok'
			});
			this.$el.html(this.template(viewModel));
			if (this.model.get('closed')) {
				this.$el.addClass('closed');
			} else {
				this.$el.removeClass('closed')
			}

			return this;
		},
		close: function() {
			this.model.close();
		},
		open: function() {
			this.model.open();
		}
	});

	return exports;

})();