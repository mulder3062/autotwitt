/*
autotwitt.js

config는 config.json을 아래와 같이 작성합니다.


- sample config.json -
{
	"allowTime": {"start":8, "end":0},	
	"interval": "2h",
	"infos":
	[
		{
			"wordFile": "word.txt",
			"oauth": {
				"consumer_key": "4Vr7ehCpFXhO1Q2CbPWQ",
				"consumer_secret": "8k1oGKDRDHzfld601ms4zFc4T1OabFsKoWomA9oEUkU",
				"access_token": "62215924-CTv9WNfSeYid8xcO49wFxdkHJK7XGeKadEZmOHQoX",
				"access_token_secret": "orebUZPoaQSZoHTVG6W1Pli23MT0LJICtv4INQeAg9eik"
			}
		},
		{
			"wordFile": "word.txt",
			"oauth": {
				"consumer_key": "3ad2312b1a123ddfdf12",
				"consumer_secret": "13123123kj123lkj123lkj123lkj123lkj123ljk12",
				"access_token": "12345678-abcdd12312312312312312312312312312312331",
				"access_token_secret": "123k123k123l1k23lk12j3lkj123lkj123lkj123lkjk"
			}
		}
	]
}
*/

require('./utils.js');
var config = require("./config.json");
var fileSys = require("fs");
var Twit = require('twit');
var globalAllowTime = config.allowTime;
var globalInterval = config.interval;

function getTimestampString(date) {
	return (date) ? '{0}-{1}-{2} {3}:{4}:{5}.{6}'.format(
					date.getFullYear(), 
					date.getMonth()+1, 
					date.getDate(), 
					date.getHours(),
					date.getMinutes(),
					date.getSeconds(),
					date.getMilliseconds()) : '';
}

function AutoTwitt(info) {
	this.info = info;
	this.wordsList = [];
	this.copyWordsList = [];
	this.interval = this.info.interval || globalInterval;

	this.init = function() {
		//console.dir(this.info);
		if (!this.info.wordFile || !this.info.oauth) return;

		this.T = new Twit({
			consumer_key: this.info.oauth.consumer_key,
			consumer_secret: this.info.oauth.consumer_secret,
			access_token: this.info.oauth.access_token,
			access_token_secret: this.info.oauth.access_token_secret
		});

		// 문구들 Array에 담기
		var text = fileSys.readFileSync(this.info.wordFile, 'utf8');
		var splitLine = text.split('\n');
		var currWords = '';
		for (var i in splitLine) {
			var line = splitLine[i].trim();
			if (line.length == 0) {
				// 빈줄이면 새로운 문구 시작
				if (currWords.length > 0) {
					this.wordsList.push(currWords.substring(0,140));
				}
				currWords = '';
			} else if (line.startsWith('#')) {
  	          // 주석은 skip
				continue;
			} else {
 	           // 빈줄이 아니면 현재 문구에 추가
				currWords += (currWords!='' ? '\n' : '') + line;
			}
		}
	};

	this.getWords = function() {
		if (this.copyWordsList.length == 0) {
			console.log('word reset!!!');
			this.copyWordsList = this.wordsList.slice(0);
		}
	
		var rnd = Math.floor((Math.random() * this.copyWordsList.length));
		var val = this.copyWordsList[rnd];
		this.copyWordsList.splice(rnd, 1);
		return val;
	};

	this.handleError = function(err) {
		console.error(err);
	};

	this.twitt = function() {
		// 허용하는 시간 범위가 아니면 트윗하지 않는다.
		var d = new Date();
		var allowTime = this.info.allowTime || globalAllowTime;
		if (d.getHours() <= allowTime.start && d.getHours() >= allowTime.end) {
			console.log('{0} skip'.format(getTimestampString(new Date())));
			return;
		}

		var words = this.getWords();
		console.log('>> ' + words);

/*
		this.T.post('statuses/update', {status: words },
			function(err, replay) {
				if(err) return this.handleError(err);
				console.log('{0} posting'.format(getTimestampString(new Date())));
			}.bind(this));
*/
	}.bind(this);


	this.run = function() {
		console.log('init...');
		this.init();
		console.log('ready...');

		if (this.wordsList.length > 0) {
			// 최초 바로 실행
			this.twitt();
			var interval = 30000; // default 30 sec
			var unit;
			var parser = /^(\d+)([smhd|SMHD]{0,1})$/;
			var match = parser.exec(this.interval);
			if (match) {
				interval = Number(match[1]);
				unit = match[2].toLowerCase();
				if (unit.length > 0) {
					switch(unit) {
						case 's' : interval = interval * 1000; break;
						case 'm' : interval = interval * 1000 * 60; break;
						case 'h' : interval = interval * 1000 * 60 * 60; break;
						case 'd' : interval = interval * 1000 * 60 * 60 * 24; break;
						default:
					}
				}
			}
					
			setInterval(this.twitt, interval);
		}
	};
}

for (var i in config.infos) {
	var autoTwitt = new AutoTwitt(config.infos[i]);
	autoTwitt.run();
}
