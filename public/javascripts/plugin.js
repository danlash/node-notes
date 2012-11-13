var NodeNodes = (function(){

	var exports = {};

	exports.App = Backbone.Model.extend({
		start: function() {

			var nav = new Navigation();
			var navView = new NavigationView({ model : nav, el : $('#navigation') }).render();

			var list = new List({ id: 2, name : 'Vacation Days' });
			var listView = new ListView({ model : list, el : $('#list'), navigation : nav });

			var setupAutoSave = function () {
				list.on('change', function(){
					Backbone.sync('update', list);
				});	
			};

			list.fetch({ success: setupAutoSave });

			this.list=list;
		}
	});

	var Navigation = Backbone.Model.extend({
		defaults: {
			'showClosed' : false,
			'adding' : false
		},
		initialize: function(){
		},
		toggleShowClosed: function() {
			this.set('showClosed', ! this.get('showClosed'));
		},
		startAdding: function(){
			this.set('adding', true);
		},
		stopAdding: function() {
			this.set('adding', false);
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
			json.notes.on('change add', function() {
				_list.trigger('change');
			});
			return json;
		},
		addNote: function(body) {
			this.get('notes').add({ body: body });
		}
	});

	var ListView = Backbone.View.extend({
		events: {
			'click #new-note .cancel' : 'cancel',
			'click #new-note .add' : 'add'
		},
		initialize: function () {
			_.bindAll(this);
			this.model.on('change', this.render);
			this.navigation = this.options.navigation;
			this.navigation.on('change:showClosed', this.render);
			this.navigation.on('change:adding', this.render);
		},
		render: function() {
			var notesView = new NotesView({ collection : this.model.get('notes'), el : $('#notes') });
			notesView.render();

			this.$el.find('#name').html(this.model.get('name'));

			this.$el.removeClass('show-closed adding');
			if (this.navigation.get('showClosed')) { this.$el.addClass('show-closed'); }
			if (this.navigation.get('adding')) { this.$el.addClass('adding'); }

			return this;
		},
		cancel: function(){
			this.navigation.stopAdding();
			this.render();
		},
		add: function(e) {
			this.navigation.stopAdding();
			this.model.addNote($('#note-body').val());
			$('#note-body').val('');
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

	var NavigationView = Backbone.View.extend({
		events: {
			'click #show-closed' : 'toggleShowClosed',
			'click #add' : 'addNote'
		},
		initialize: function(){
			_.bindAll(this);
			this.model.on('change', this.render);
		},
		render: function(){
			var $button = this.$el.find('#show-closed');
			$button.removeClass('active')
			if (this.model.get('showClosed')) { 
				$button.addClass('active'); 
			}

			return this;
		},
		toggleShowClosed: function(){
			this.model.toggleShowClosed();
		},
		addNote: function(){
			this.model.startAdding();
		}
	});


	return exports;

})();