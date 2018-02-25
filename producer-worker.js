var redis = require('redis');
var q = require('./queue');

var redisClient = redis.createClient();
var Queue = q.Queue;

var logQueue = new Queue('log_queue', redisClient);
var MAX = 5;
var i;
for(i=0; i<MAX; i++) {
	logQueue.enqueue('Hello World #' + i);
}

console.log('Created queue', 'log_queue of size', MAX);
redisClient.quit();