window.PlantView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deletePlant",
        "drop #picture" : "dropHandler"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        
        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }

        FB.getLoginStatus(
            function(response) {
                //console.log(response.status)
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.

                    //Obtain the User Name Strings to pass into the model.
                    FB.api("/me", function(response) {
                        var name = response.first_name + " " + response.last_name;
                        //console.log("Fetched FB name upon save, name = " + name);
                        var email = response.email;
                        var fbID = response.id;

                        //console.log(response);
                        self.model.set({fbName: name});
                        self.model.set({email: email});
                        self.model.set({fbId: fbID});
                        self.savePlant();
                    });

                    //console.log("Fetching name to attach to model: " response.);

                } else if (response.status === 'not_authorized') {
                    // The person is logged into Facebook, but not your app.
                    alert("You need to be logged-in to floraMap to do that")
                } else {
                    // The person is not logged into Facebook, so we're not sure if
                    // they are logged into this app or not.
                    alert("You need to be logged-in to Facebook to do that!")

                }
            }
        )

        return false;
    },

    savePlant: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('plants/' + model.id, false);
                utils.showAlert('Success!', 'Plant saved successfully', 'alert-success');
                
                // Update the map in order to get the new plant also shown on the map
                updateMap();
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deletePlant: function () {
        this.model.destroy({
            success: function () {
                alert('Plant deleted successfully');
                updateMap(); // Update the markers on the map
                mylocation();
                window.history.back();
            }
        });
        return false;
    },

    // This function is used to get the plant after the user drop a image file on a specific
    // area of the page. However, it is not working well yet. 
    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }

});