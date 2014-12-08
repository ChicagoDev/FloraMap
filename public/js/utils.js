window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
           if (window[view]) {
                deferreds.push($.get('templates/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found ");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent();
        var formControlFeedback = $('#' + field + " ~ .form-control-feedback");
        formControlFeedback.addClass("glyphicon glyphicon-remove");
        controlGroup.addClass('has-error has-feedback'); 
        $('.help-block', controlGroup).html(message);
         
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent();
        var formControlFeedback = $('#' + field + " ~ .form-control-feedback");
        formControlFeedback.removeClass("glyphicon glyphicon-remove");
        controlGroup.removeClass('has-error has-feedback');
        $('.help-block', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    },
    
    mapIt:function(option, plant){
        if(option){
            $("#mobile-home, #content").addClass("hidden-xs");
            //destroy_map();
            init_map('mobile-map');
            addSingleMarker(plant);
            $("#mobile-map").removeClass("hidden-xs");
            $("#back").removeClass("hidden-xs");
            $("#back").css("margin-top","15px");
            
           /* $("#mobile-home").removeClass("visible-xs-block");
            $("#content").parent().removeClass("visible-md-block");
            $("#content").parent().removeClass("visible-lg-block");
            $("body").height( $("#map").height());*/
        }
        else{
            $("#mobile-home, #content").removeClass("hidden-xs");
            $("#mobile-map").addClass("hidden-xs");
            $("#back").addClass("hidden-xs");
            /*$("#mobile-home").addClass("visible-xs-block");
            $("#content").parent().addClass("visible-md-block");
            $("#content").parent().addClass("visible-lg-block");   */     
        }
    },
    
    backlist:function(){
        this.mapIt(false,null);
    },
    
    hideLogoImg: function (option){
        if(option == true){
            $('.navbar-brand span').css("display","block");
            $('.navbar-brand img').css("display","none");  
        }
        else{
            $('.navbar-brand span').css("display","none");
            $('.navbar-brand img').css("display","block"); 

    }
}


};