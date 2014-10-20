function hideLogoImg(option){
    if(option == true){
        $('.navbar-brand span').css("display","block");
        $('.navbar-brand img').css("display","none");  
    }
    else{
        $('.navbar-brand span').css("display","none");
        $('.navbar-brand img').css("display","block"); 
    
    }
}

var AppRouter = Backbone.Router.extend({

	routes: {
		""                   : "home",
		"login"              : "login",
		"plants"	         : "list",
		"plants/page/:page"	 : "list",
		"plants/add"         : "addPlant",
		"plants/:id"         : "plantDetails",
		"about"              : "about"
	},

	initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('');
        hideLogoImg(true);
        //$('#map_view').load("tpl/MapView.html");
    },

    login: function () {
        if (!this.loginView) {
            this.loginView = new LoginView();
        }
        $('#content').html(this.loginView.el);
        this.headerView.selectMenuItem('login-menu');
        hideLogoImg(false);
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var plantList = new PlantCollection();
        plantList.fetch({success: function(){
            $("#content").html(new PlantListView({model: plantList, page: p}).el);  console.log("MAIN");
        }});
        this.headerView.selectMenuItem('browse-menu');
        hideLogoImg(false);
    },

    plantDetails: function (id) {
        var plant = new Plant({_id: id});
        plant.fetch({success: function(){
            $("#content").html(new PlantView({model: plant}).el);            
        }});
        this.headerView.selectMenuItem();
        hideLogoImg(false);
    },

	addPlant: function() {
        var plant = new Plant();
        $('#content').html(new PlantView({model: plant}).el);
        this.headerView.selectMenuItem('add-menu');
        hideLogoImg(false);
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
        hideLogoImg(false);
    }

});

utils.loadTemplate(['HomeView','LoginView', 'HeaderView', 'PlantView', 'PlantListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});