window.Plant= Backbone.Model.extend({

    urlRoot: "/plants",

    idAttribute: "_id",

    // If you want to validate any field in the plant form, you need to put it on this function
    initialize: function () {
        this.validators = {};
        
        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
        
        this.validators.latitude = function (value) {
            return value != '' ? {isValid: true} : {isValid: false, message: ""};
        };
        
        this.validators.longitude = function (value) {
            return value != '' ? {isValid: true} : {isValid: false, message: ""};
        };

        //TODO Adda  validator for facebook name, but facebook name is never set until after save is called.... So maybe more of a v2.0 thing.
        //
        //When We add a username to a form, re comment this in.
        /*this.validators.userName = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };*/
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        latitude: "",
        longitude: "",
        name: "",
        description: "",
        picture: null,
        fbName:""
        //userName: ""
    }
});

window.PlantCollection = Backbone.Collection.extend({

    model: Plant,

    url: "/plants"

});