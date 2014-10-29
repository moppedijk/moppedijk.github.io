var FedApp = FedApp || {};
	FedApp.Components = FedApp.Components || {};
	FedApp.Models = FedApp.Models || {};
	FedApp.Views = FedApp.Views || {};	

(function(){
	
	/**
	 	Controller object that initializes the application
	*/
	FedApp.App = {

		init: function () {
			console.log("Initialize App");
			
			FedApp.Config = {
				appId: "fed-app"
			}

			this.startApp();
		},
		startApp: function () {
			FedApp.Router.init();
		}
	}

})();;(function(){
	
	FedApp.Router = {

		currentView: false,

		init: function () {

			var routes = {
				'': function() {
					console.log("empty");
					FedApp.Components.Loader.show();
					setTimeout(function(){
						FedApp.Router.showMain();
					}, 300);
				},
				'/home': function() {
					console.log("/home");
					FedApp.Components.Loader.show();
					setTimeout(function(){
						FedApp.Router.showMain();
					}, 300);
				},
				'/about': function() {
					console.log("/about");
					FedApp.Components.Loader.show();
					setTimeout(function(){
						FedApp.Router.showAbout();
					}, 300);
				},
				'/main':{
					'/:type': {
						on: function(type) {
							console.log("main/" + type);
							FedApp.Components.Loader.show();
							setTimeout(function(){
								FedApp.Router.showList({
									type: type,
									locality: false
								});
							}, 300);
						}
					}
				},
				'/main/:type/search': {
					'/:search': {
						on: function(type, search) {
							console.log("/main/" + type + "/search/" + search);
							FedApp.Components.Loader.show();
							setTimeout(function(){
								FedApp.Router.showList({
									type: type,
									locality: search
								});
							}, 300);
						}
					}
				},
				'/main/:type/detail': {
					'/:cidn': {
						on: function(type, cidn) {
							console.log("/main/:" + type + "/detail/" + cidn);
							FedApp.Components.Loader.show();
							setTimeout(function(){
								FedApp.Router.showDetail({
									type: type,
									cidn: cidn
								});
							}, 300);
						}
					}
				},
				'/*': function() {
					FedApp.Components.Loader.show();
					FedApp.Router.showPage404();
				}
			};

			var router = Router(routes).init();

		},
		showMain: function() {
			console.log("show main");

			var view = new FedApp.Views.Main();

			FedApp.Router.showView(view);
			FedApp.Router.showMenuState("home");
		},
		showList: function(obj) {
			console.log("show list");

			var listModel = new FedApp.Models.List();

			listModel.get({
				type: obj.type,
				params: {
					page: 1,
					per_page: 100,
					locality: obj.locality,
					after: "2014-10-22"
				}
			});

			listModel.events.on("loadDataComplete", function(data) {

				console.log(data);

				var view = new FedApp.Views.List(data);
				FedApp.Router.showView(view);
				FedApp.Router.showMenuState(obj.type);

				listModel.events.off("loadDataComplete");
			});

		},
		showDetail: function(obj) {
			console.log("show detail");

			// Load Data
			var singleObject = new FedApp.Models.SingleObject();

			singleObject.get({
				type: obj.type,
				cidn: obj.cidn
			})

			singleObject.events.on("loadDataComplete", function(data){

				console.log(data);

				var view = new FedApp.Views.Detail(data);
				FedApp.Router.showView(view);

				singleObject.events.off("loadDataComplete");
			});
		},
		showAbout: function () {
			console.log("show about");

			var view = new FedApp.Views.About();
			
			FedApp.Router.showView(view);
			FedApp.Router.showMenuState("about");
		},
		showPage404: function () {
			console.log("show Page404");

			var view = new FedApp.Views.Page404();

			console.log(view);

			view.events.on("load404Complete", function(view){

				FedApp.Router.showView(view);
			});
		},
		showView: function (view) {
			console.log("show View");

			FedApp.Router.currentView = view;

			var container = document.getElementById(FedApp.Config.appId);
			container.innerHTML = FedApp.Router.currentView.render();

			if(FedApp.Router.currentView.afterRender)
				FedApp.Router.currentView.afterRender();

			// Hide Loader
			FedApp.Components.Loader.hide();
		},
		showMenuState: function(view) {
			var globalNav = document.getElementById("global-nav");
			var globalNavItems = new Array("global-nav--home", "global-nav--about");
			var mainNav = document.getElementById("main-nav");
			var mainNavItems = new Array("main__nav--event", "main__nav--venue", "main__nav--production");

			switch(view) {
				case "home":
					FedApp.Router.setMenuState({
						items: globalNavItems,
						active: "global-nav--home",
						target: globalNav
					});
					break;
				case "about":
					FedApp.Router.setMenuState({
						items: globalNavItems,
						active: "global-nav--about",
						target: globalNav
					});
					break;
				case "event":
					FedApp.Router.setMenuState({
						items: mainNavItems,
						active: "main__nav--event",
						target: mainNav
					});
					FedApp.Router.setMenuState({
						items: globalNavItems,
						active: false,
						target: globalNav
					});
					break;
				case "venue":
					FedApp.Router.setMenuState({
						items: mainNavItems,
						active: "main__nav--venue",
						target: mainNav
					});
					FedApp.Router.setMenuState({
						items: globalNavItems,
						active: false,
						target: globalNav
					});
					break;
				case "production":
					FedApp.Router.setMenuState({
						items: mainNavItems,
						active: "main__nav--production",
						target: mainNav
					});
					FedApp.Router.setMenuState({
						items: globalNavItems,
						active: false,
						target: globalNav
					});
					break;
			}
		},
		setMenuState: function(obj) {
			for(var i = 0;i < obj.items.length; i++) {
				if(obj.target.hasClass(obj.items[i])){
					obj.target.removeClass(obj.items[i]);
				}
				if(obj.active) {
					obj.target.addClass(obj.active);
				}
			}
		}
	}

})();;(function(){

	FedApp.Components.Filter = {
		removeHtml: function(string) {
		 	if(string){
		 		var str = JSON.stringify(string);
		 	 	var strInputCode = str.replace(/&(lt|gt);/g, function (strMatch, p1){
		 		 	return (p1 == "lt")? "<" : ">";
		 		});
		 		var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
		 		str = strTagStrippedText;
		 	}
			return str;
		},
		trimString: function(string, number) {

			var str = string;
			var subStr = "";

			if(str.length > number) {
				subStr = str.substring(0, number);
			}else {
				subStr = str;
			}

			return subStr;
		},
		createStringFromObject: function(obj) {

			return string;
		}
	}

})();;(function(){

	FedApp.Components.Loader = {
		loading: false,
		show: function() {
			var loader = document.getElementById("loader");

			if(loader.hasClass('loader--inactive') ) {
				loader.addClass('loader--isactive');
				loader.removeClass('loader--inactive');
			}
		},
		hide: function() {
			var loader = document.getElementById("loader");
			
			if(loader.hasClass('loader--isactive') ) {
				loader.addClass('loader--inactive');
				loader.removeClass('loader--isactive');
			}
		}
	}

})();;(function(){

	var List = function() {

		this.path = "http://api.artsholland.com/rest";

		this.events = new Events();

		this.init = function() {
			console.log("Initialize List model");
		}

		this.get = function(obj) {

			var _self = this;
			var type = obj.type;
			if(!obj.params.locality)
				obj.params.locality = "amsterdam";

			var params = obj.params;
			var url = this.path + "/" + type + ".json";

			JSONP({
				url: url,
				data: params,
			    success: function(data) {
					_self.filterList({
						type: type,
						data: data
					});
			    },
			    error: this.onErrorHandler
			});
		};

		this.filterList = function(obj) {

			var data = obj.data;
			var filter = FedApp.Components.Filter;

	    	for(var i = 0; i < data.results.length; i++) {
				var result = data.results[i];
					result.listType = obj.type;

				if(!result.attachment)
					result.attachment = false;
				if(!result.created){
					result.created = "No date";
				}else {
					var created = filter.trimString(result.created, 10);
					result.created = created;
				}
				if(!result.description)
					result.description = "No description";
				if(!result.eventStatus)
					result.eventStatus = false;
				if(!result.genre)
					result.genre = false;
				if(!result.hasBeginning)
					result.hasBeginning = false;
				if(!result.hasEnd)
					result.hasEnd = false;
				if(!result.homepage)
					result.homepage = false;
				if(!result.languageNoProblem)
					result.languageNoProblem = false;
				if(!result.modified)
					result.modified = false;
				if(!result.offers)
					result.offers = false;
				if(!result.production)
					result.production = false;
				if(!result.productionType)
					result.productionType = false;
				if(!result.shortDescription){
					var description = filter.removeHtml(result.description);
					var shortDescription = filter.trimString(description, 75);
					result.shortDescription = shortDescription;
				}else {
					var description = filter.removeHtml(result.shortDescription);
					var shortDescription = filter.trimString(description, 75);
					result.shortDescription = shortDescription;
				}
				if(!result.sameAs)
					result.sameAs = false
				if(!result.title)
					result.title = "Untitled";
				if(!result.type)
					result.type = false
				if(!result.uri)
					result.uri = false;
				if(!result.venue)
					result.venue = false
				if(!result.venueType)
					result.venueType = false;
	    	}

		    data.metadata.listType = obj.type;

			this.events.emit("loadDataComplete", data);
		}

		this.onErrorHandler = function(data) {
			alert("ERROR: " + data);
		};

		this.init();
	}

	FedApp.Models.List = List;

})();;(function(){
	
	var SingleObject = function(data) {

		this.path = "http://api.artsholland.com/rest";

		this.events = new Events();

		this.type = false;

		this.init = function() {
			console.log("Initialize SingelObject model");
		}

		/**
			Get single object gets a single object from a type and given cidn
			@type string 'event'
			@cidn string '2008-A-047-0143827'
		*/
		this.get = function(data) {

			console.log(data);

			var _self = this;
			var cidn = data.cidn.toLowerCase();

			this.type = data.type;

			var url = this.path + "/" + this.type + "/" + cidn + ".json";

			JSONP({
				url: url,
			    success: function(data) {
			    	_self.filterSingelObj(data);
			    },
			    error: this.onErrorHandler
			});
		};

		this.filterSingelObj = function(data) {

			var result = data.results[0];

			console.log(result);

			if(!result.created)
				result.created = "No data about creation";
			if(!result.description)
				result.description = "No description";
			if(!result.email)
				result.email = "No email";
			if(!result.homepage)
				result.homepage = "No homepage";
			if(!result.locationAddress)
				result.locationAddress = "No location address";
			if(!result.listType)
				result.listType = this.type;
			if(!result.modified) {
				result.modified = "No information about modification";
			}else{
				if(typeof(result.modified) == typeof([])) {
					var output = "";
					for(var i = 0; i < result.modified.length; i++) {
						output += ", " + result.modified[i];
					}
					result.modified = output.slice(2);
				}
			};
			if(!result.sameAs)
				result.sameAs = "Noting same as";
			if(!result.shortDescription)
				result.shortDescription = "No short description";
			if(!result.telephone)
				result.telephone = "No telephone";
			if(!result.title)
				result.title = "Untitled";
			if(!result.type)
				result.type = "No type";
			if(!result.uri)
				result.uri = "No uri";
			if(!result.venueType)
				result.venueType = "No venue type";

			this.events.emit("loadDataComplete", result);
		};

		this.onErrorHandler = function(data) {
			alert("ERROR: " + data);
		};

		this.init(data);
	}

	FedApp.Models.SingleObject = SingleObject;

})();;(function() {

	var About = function (data) {

		this.template = "template-about";

		this.model = false;

		this.events = new Events();

		this.init = function(data) {
			console.log("Initalize About");
		};

		this.render = function () {
			var templateId = document.getElementById( this.template );

			var source   = templateId.innerHTML;
			var template = Handlebars.compile( source );

			return template();
		}

		this.init(data);
	}

	FedApp.Views.About = About;

})();;(function(){

	var Detail = function(data) {

		this.template = "template-detail";

		this.model = false;

		this.events = new Events();

		this.init = function(data) {
			console.log("Initialize Detail View");
			this.model = data;
		};

		this.render = function() {

			var templateId = document.getElementById( this.template );

			var source   = templateId.innerHTML;
			var template = Handlebars.compile(source);

			return template(this.model)
		};

		this.afterRender = function() {
			console.log("afterRender");
		}

		this.dispose = function() {

		};

		this.init(data);
	};

	FedApp.Views.Detail = Detail;

})();;(function(){

	var List = function(data) {

		this.template = "template-main";

		this.subTemplate = "template-list";

		this.model = false;

		this.events = new Events();

		this.init = function(data) {
			console.log("Initialize List view");
			this.model = data;
		};

		this.render = function() {

			var templateId = document.getElementById(this.template);
			var source   = templateId.innerHTML;
			var template = Handlebars.compile(source);

			return template(this.model);
		};

		this.afterRender = function() {

			var templateId = document.getElementById(this.subTemplate);
			var source = templateId.innerHTML;
			var template = Handlebars.compile(source);
			var subView = document.getElementById("main-content");
				subView.innerHTML = template(this.model);

			// var searchBtn = document.getElementById("form-btn-submit");
			// searchBtn.addEventListener("click", this.onClickHandler);
		};

		this.dispose = function() {

		};

		/*
		 	User input handlers
		*/
		
		this.onClickHandler = function(e) {

			var inputLocality = document.getElementById("form-input-locality");

			console.log(window);

			if(!inputLocality){
				alert("Graag een stad invullen");
			}else {
				alert("Zoek: " + inputLocality.value);
			}
		};

		this.onKeyPressHandler = function(e) {

	        if (e.keyCode == 13) {
				
				console.log(data);

	        	var listType = "event";
	        	var query = e.target.value;
				routie("main/" + listType + "/" + query);
	        };
		};

		/*
			Intialize constructor
		*/

		this.init(data);
	};

	FedApp.Views.List = List;

})();;(function(){

	var Main = function(obj) {

		this.template = "template-main";

		this.subTemplate = "template-home";

		this.model = false;

		this.events = new Events();

		this.init = function(obj) {
			console.log("Initialize main");
		};

		this.render = function() {

			var templateId = document.getElementById(this.template);
			var source   = templateId.innerHTML;
			var template = Handlebars.compile(source);

			return template();
		};

		this.afterRender = function() {
			
			var templateId = document.getElementById(this.subTemplate);
			var source   = templateId.innerHTML;
			var template = Handlebars.compile(source);
			var subView = document.getElementById("main-content");
				subView.innerHTML = template();

		};

		this.init(obj);
	}

	FedApp.Views.Main = Main;

})();;(function(){

	var Page404 = function(obj) {

		this.template = "template-404";

		this.events = new Events();

		this.init = function(obj) {
			this.render();
		}

		this.render = function() {

			var templateId = document.getElementById( this.template );

			var source   = templateId.innerHTML;
			var template = Handlebars.compile(source);

			return template();
		}

		this.init(obj);
	}

	FedApp.Views.Page404 = Page404;

})();