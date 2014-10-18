var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'), 
    morgan = require('morgan'),
    errorhandler = require('errorhandler'),
    plant = require('./routes/plants'),
    app = express();

process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
    app.set('port', process.env.PORT || 3000);
    
    app.use(errorhandler())
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

};

app.get('/plants', plant.findAll);
app.get('/plants/:id', plant.findById);
app.post('/plants', plant.addPlant);
app.put('/plants/:id', plant.updatePlant);
app.delete('/plants/:id', plant.deletePlant);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
})