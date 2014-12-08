var AppRouter = Backbone.Router.extend({

	routes: {
		""                   : "home",
		"login"              : "login",
		"plants"	         : "list",
		//"plants/page/:page"	 : "list", // used if pagination is ativated
		"plants/add"         : "addPlant",
		"plants/:id"         : "plantDetails",
		"about"              : "about"
	},

	initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
        
        if($(document).width() > 990){ 
            init_map('map'); // Initialize the map
        }
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content, #mobile-home').html(this.homeView.el);
        this.headerView.selectMenuItem('');
        utils.mapIt(false, null);
        utils.hideLogoImg(true);
    },

    login: function () {
        if (!this.loginView) {
            this.loginView = new LoginView();
        }
        $('#content').html(this.loginView.el);
        this.headerView.selectMenuItem('login-menu');
        utils.hideLogoImg(false);
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var plantList = new PlantCollection();
        plantList.fetch({success: function(){
            $("#content, #mobile-home").html(new PlantListView({model: plantList, page: p}).el); 
        }});
        
        // Remove the current markers on the map and adding gain, in order to update
        updateMap();
        
        this.headerView.selectMenuItem('browse-menu');
        utils.hideLogoImg(false);
    },

    plantDetails: function (id) {
        var plant = new Plant({_id: id});
        plant.fetch({success: function(){
            $("#content, #mobile-home").html(new PlantView({model: plant}).el);   
        }});
        this.headerView.selectMenuItem();
        
        $(".form-actions .delete").add();
        $(".submittedby-group").add();
        $("img#thumbnail").add();
        
        updateMap();
        
        utils.hideLogoImg(false);
    },

	addPlant: function() {
        var plant = new Plant();
        
        $('#content, #mobile-home').html(new PlantView({model: plant}).el);
        this.headerView.selectMenuItem('add-menu');
        
        $(".form-actions .delete").remove();
        $(".submittedby-group").remove();
        $("img#thumbnail").remove();
        utils.hideLogoImg(false);
        currentLocation();
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content, #mobile-home').html(this.aboutView.el);
        
        this.headerView.selectMenuItem('about-menu');
        utils.hideLogoImg(false);
    }

});

// ALL template views need to be placed on this line
utils.loadTemplate(['HomeView','LoginView', 'HeaderView', 'PlantView', 'PlantListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});