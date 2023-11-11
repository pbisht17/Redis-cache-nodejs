const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.set('hi', 'Boss');
client.get('hi', (err, data) => {
    console.log('Value is', data)
})
console.log(client)


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