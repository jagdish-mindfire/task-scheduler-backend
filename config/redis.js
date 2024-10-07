const Redis = require('redis');

const redisClient = Redis.createClient({host:'172.31.9.240', port: 6379});


(async () => {
    await redisClient.connect();
})();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;