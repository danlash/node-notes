var NodeNodes = (function(){

	var exports = {};

	exports.App = Backbone.Model.extend({
		start: function() {

			var nav = new Navigation();
			var navView = new NavigationView({ model : nav, el : $('#navigation') }).render();

			var listView = new ListView({ el : $('#list'), navigation : nav });
		}
	});

	var Navigation = Backbone.Model.extend({
		defaults: {
			'showClosed' : false,
			'adding' : false,
			'lists' : [],
			'currentList' : null
		},
		initialize: function(){
			_.bindAll(this);
			$.ajax({ url: 'list', success: this.setupLists });
		},
		setupLists: function(json) {
			var lists = JSON.parse(json);
			this.set('lists', lists);
			if (lists.length > 0) { this.changeList(lists[0].id); }
		},
		toggleShowClosed: function() {
			this.set('showClosed', ! this.get('showClosed'));
		},
		startAdding: function(){
			this.set('adding', true);
		},
		stopAdding: function() {
			this.set('adding', false);
		},
		changeList: function(listId) {
			this.set('currentList', listId);
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
			this.navigation = this.options.navigation;
			this.navigation.on('change:showClosed', this.render);
			this.navigation.on('change:adding', this.render);
			this.navigation.on('change:currentList', this.changeModel);
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
		},
		changeModel: function(){
			var list = new List({ id: this.navigation.get('currentList') });
			this.model = list;
			this.model.on('change', this.render);

			var setupAutoSave = function () {
				list.on('change', function(){
					Backbone.sync('update', list);
				});	
			};

			this.model.fetch({ success: setupAutoSave });
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
			'click #add' : 'addNote',
			'click .change-list' : 'changeList'
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

			var menu = '<li><a href="#">New Category</a></li>';
            menu += '<li class="divider"></li>';

            for (var i = this.model.get('lists').length - 1; i >= 0; i--) {
            	var list = this.model.get('lists')[i];
            	menu += '<li><a href="#" class="change-list" data-id="'+list.id+'">'+list.name+'</a></li>';
            }

			this.$el.find('.dropdown-menu').empty().append(menu);

			return this;
		},
		toggleShowClosed: function(){
			this.model.toggleShowClosed();
		},
		addNote: function(){
			this.model.startAdding();
		},
		changeList: function(e){
			var listId = $(e.currentTarget).data().id;
			this.model.changeList(listId);
		}
	});


	return exports;

})();