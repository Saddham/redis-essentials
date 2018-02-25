function Queue(queueName, redisClient) {
	this.queueName = queueName;		
	this.queueKey = 'queues:' + queueName;
	this.redisClient = redisClient;
	this.timeout = 0;
}

Queue.prototype.enqueue = function(item) {
	this.redisClient.lpush(this.queueKey, item);
};

Queue.prototype.dequeue = function(callback) {
	this.redisClient.brpop(this.queueKey, this.timeout, callback);
};

Queue.prototype.size = function(callback) {
	this.redisClient.llen(this.queueKey, callback);
};

exports.Queue = Queue;