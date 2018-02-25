var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on('error', function (err) {
    console.log('error event - ' + redisClient.host + ':' + redisClient.port + ' - ' + err);
});

function reset(dealIds) {
	redisClient.del(dealIds);
}

function markDealAsSent(dealId, userId) {
	redisClient.sadd(dealId, userId);
	console.log('Sent deal', dealId, 'to', userId);
}

function sendDealIfNotSent(dealId, userId) {
	redisClient.sismember(dealId, userId, function(err, reply) {		
		if(reply == 1 || reply == '1')
			console.log('Already sent deal', dealId, 'to', userId);
		else
			markDealAsSent(dealId, userId);
	});
}

function showDealUsers(dealId) {
	redisClient.smembers(dealId, function(err, replies) {
		console.log('Users who received deal', dealId, ':', replies);
	});
}

function showUsersThatReceivedAllDeals(dealIds) {
	redisClient.sinter(dealIds, function(err, replies) {
		console.log('Users who received all deals', replies);
	});
}

function showUsersThatReceivedAtLeastOneDeal(dealIds) {
	redisClient.sunion(dealIds, function(err, replies) {
		console.log('Users who received at least one deal', replies);
	});
}

reset(["deal:1", "deal:2", "deal:3"]);

markDealAsSent('deal:1', 'user:1');
markDealAsSent('deal:1', 'user:2');

markDealAsSent('deal:2', 'user:1');
markDealAsSent('deal:2', 'user:3');

markDealAsSent('deal:3', 'user:1');
markDealAsSent('deal:3', 'user:4');

sendDealIfNotSent('deal:3', 'user:5');

showDealUsers("deal:1");
showDealUsers("deal:2");
showDealUsers("deal:3");

showUsersThatReceivedAtLeastOneDeal(["deal:1", "deal:2", "deal:3"]);
showUsersThatReceivedAllDeals(["deal:1", "deal:2", "deal:3"]);

redisClient.quit();