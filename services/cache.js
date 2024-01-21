const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function(){
    console.log('Inside of the mongoose query');
    console.log(this.getQuery()); //
    console.log(this.mongooseCollection.name); //returns the name of collection
    console.log(this.getOptions());
    Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    })
    return exec.apply(this, arguments);
}