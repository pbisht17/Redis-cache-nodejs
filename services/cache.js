const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget); // return a new function that can promisified so that we dont have to use callback inside of client.get('key', callback)
const exec = mongoose.Query.prototype.exec;

/**
 * 
 * getQuery():

    The getQuery() method is used to retrieve the conditions of the query.
    It returns an object representing the query conditions.
    For example, if your query is Model.find({ name: 'John', age: { $gte: 25 } }), getQuery() would return { name: 'John', age: { $gte: 25 } }.
 
    getOptions():

    The getOptions() method is used to retrieve the options associated with the query.
    It returns an object representing various options that can be set for the query.
    Common options include select, sort, limit, and skip.
    For example, if your query includes options like Model.find({}).select('name').limit(10).skip(5), getOptions() would return { select: 'name', limit: 10, skip: 5 }.
 
    */
/**
 * mongoose.Query.prototype is using prototypal inheritance. So we can add any numerous amount of function/method into it.
 * @returns 
 */ 

mongoose.Query.prototype.cache = function(options={}) {
    this.usedCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}
mongoose.Query.prototype.exec = async function(){
    console.log('Inside of the mongoose query');
    console.log(this.getQuery());   // Log the query conditions
    console.log(this.mongooseCollection.name); //returns the name of collection
    console.log(this.getOptions());  // Log the query options
    if(!this.usedCache) {
        const result = await exec.apply(this, arguments);
        return result;
    }
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }))
    console.log(key)
    const cacheValue = await client.hget( this.hashKey, key); //Getting Cache value using key

    if(cacheValue) {
        console.log('Getting Cache value');
        console.log(cacheValue);
        const doc = JSON.parse(cacheValue)

        /**
         * In below code we can't simply do the JSON.parse(cachevalue) becoz the exec function is expecting to return a mongoose model rather than a 
         * plain JSON object. For this we need to convert it into the model object before returning it to handler
         */
        return Array.isArray(doc) ? 
         doc.map(d => new this.model(d)) : 
         new this.model(doc)   
    }
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); //EX for expiration of cache value and 10 for 10 sec
    console.log(result);
    return result;
    
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
};