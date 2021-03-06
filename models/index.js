/**
 * Model Loader
 * ------------
 * based off of examples from: http://redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html
 */
var Sequelize  = require('sequelize');
var db         = require('config').database;

// init databse connection
var sequelize = new Sequelize(
    db.name,
    db.username,
    db.password,
    db.options
);

// load model files
var fs         = require('fs');
var dir        = require('config').directories;
var path       = require('path');
var modelFiles = fs.readdirSync(dir.models);

// Announce
console.log('Loading Models');

modelFiles.forEach(function (file) {
    // make sure file is not this one!
    if (file.indexOf('index') !== 0) {
        // get file path and resolve absolute path
        var filePath  = path.resolve('./', dir.models, file);
        var modelName = path.basename(filePath, '.js');
        
        // export model to use in app
        var modelObject = sequelize.import(filePath);
        
        // make sure table exists
        modelObject.sync();
        
        // store model for app
        module.exports[modelName] = modelObject;
        
        console.log('> ' + file + ' loaded');
    }
});

// Define Relationships
(function(m){
    m.User.hasMany(m.Token, { as : "Clients" });
    m.Token.belongsTo(m.User);
})(module.exports);

// export connection
module.exports.sequelize = sequelize;