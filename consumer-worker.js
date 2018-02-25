var redis = require('redis');
var q = require('./queue');

var redisClient = redis.createClient();
var Queue = q.Queue;

var logQueue = new Queue('log_queue', redisClient);
var printLogMessge = function() {
	logQueue.dequeue(function(err, replies) {
		console.log('Got log ' + replies[1]);
	});

	logQueue.size(function(err, len) {
		if(len > 0)
			printLogMessge();
	});
};

printLogMessge();