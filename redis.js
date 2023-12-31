const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';    // Redis local-url on which it is running
const client = redis.createClient(redisUrl);  // Creating Redis client

//Simple key-value pair

client.set('hi', 'Boss');       // Setting up a key-value pair in cache
client.get('hi', (err, data) => {     // Getting that above key-value pair and using a callback
    console.log('Value is', data)
})
console.log(client)


// nested key-value pair

client.hset('german', 'red', 'rot')

client.hget('german', 'red', (err, data)=> {
    console.log('HGet :', data);
})


client.set('color', JSON.stringify({ red: 'rojo', orange: 'orange' }));
client.get('color', (err, data) => {
    console.log(JSON.parse(data));
});


const redisValue = {
    spanish: {
        red: 'rojo',
        orange: 'naranja',
        blue: 'azul',
    },
    german: {
        red: 'rot',
        orange: 'orange',
        blue: 'blau',
    }
}