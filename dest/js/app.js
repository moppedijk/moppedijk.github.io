var fedApp = fedApp || {};
	fedApp.views = fedApp.views || {};
	fedApp.config = fedApp.config || {};

(function(){
	
	fedApp.app = {

		init: function (data) {
			// load data
			fedApp.config = data;

			// start router
			fedApp.router.init();
		}
	}

})();;(function(){
	
	fedApp.router = {

		init: function () {
			routie({
				'': function() {
					console.log("show home");
					fedApp.router.showHome();
				},
				'home': function() {
					console.log("show home");
					fedApp.router.showHome();
				},
				'about': function() {
					console.log("show about");
					fedApp.router.showAbout();
				}
			})
		},
		showHome: function () {
			console.log("showHome");
			var view = fedApp.views.home.render();
			var container = document.getElementById(fedApp.config.appId);

			container.innerHTML = view();
		},
		showAbout: function () {
			console.log("showAbout");
			var view = fedApp.views.about.render();
			var container = document.getElementById(fedApp.config.appId);

			container.innerHTML = view();
		}
	}

})();;(function(){

	fedApp.views.about = {
		template: "template-about",
		init: function () {
		},
		render: function () {
			var templateId = document.getElementById( fedApp.views.about.template );

			var source   = templateId.innerHTML;
			var template = Handlebars.compile( source );

			return template;
		},
		afterRender: function () {
			
		},
		dispose: function () {

		}
	}

})();;(function(){

	fedApp.views.home = {
		template: "template-home",
		init: function () {
		},
		render: function () {
			var templateId = document.getElementById( fedApp.views.home.template );

			var source   = templateId.innerHTML;
			var template = Handlebars.compile( source );

			return template;
		},
		afterRender: function () {
			
		},
		dispose: function () {

		}
	}

})();