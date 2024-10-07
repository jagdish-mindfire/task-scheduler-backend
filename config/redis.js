const Redis = require('redis');

const redisClient = Redis.createClient({url: 'redis://redis:6379'});


(async () => {
    await redisClient.connect();
})();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;