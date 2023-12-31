const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function(){
    console.log('Inside of the mongoose query');
    return exec.apply(this, arguments);
}