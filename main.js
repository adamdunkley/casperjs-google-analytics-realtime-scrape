var casperGoogle = require('casper').create();
var casperPush = require('casper').create();

var pushUrl = casperGoogle.cli.args[2];

function getLinks() {
    var links = document.querySelectorAll('a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href')
    });
}

casperPush.start('http://google.com/', function() {
    // Do nothing
});

casperGoogle.start('https://accounts.google.com/ServiceLogin?service=analytics&passive=true&nui=1&hl=en&continue=https%3A%2F%2Fwww.google.com%2Fanalytics%2Fweb%2F%3Fhl%3Den&followup=https%3A%2F%2Fwww.google.com%2Fanalytics%2Fweb%2F%3Fhl%3Den', function() {
    // search for 'casperGooglejs' from google form
    this.fill('form#gaia_loginform', { 
        Email: casperGoogle.cli.args[0],
        Passwd: casperGoogle.cli.args[1]
    }, true);
});

casperGoogle.waitFor(function check() {
    return this.evaluate(function() {
        return getLinks().length > 2;
    });
}, function then() {
    this.echo(JSON.stringify(getLinks()));
}, function timeout() {}, 10000);

casperGoogle.thenClick('a.TARGET-a13178224w42282195p42203101', function() {
    this.echo('Logged in, we\'re here: ' + this.getCurrentUrl());
});

casperGoogle.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('.TARGET-rt-overview a[title=Overview]').length;
    });
}, function then() {
    this.echo('Found realtime link');
}, function timeout() {}, 10000);

casperGoogle.thenClick('.TARGET-rt-overview a[title=Overview]', function() {
    this.echo('Gone to realtime page: ' + this.getCurrentUrl());
});

var currentValue = null;
casperGoogle.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('#ID-overviewCounterValue').length;
    });
}, function then() {
    this.echo('Found realtime counter');
    var sendCurrent = function() {
        if (currentValue === null || currentValue != this.fetchText('#ID-overviewCounterValue')) {
            currentValue = this.fetchText('#ID-overviewCounterValue');
            this.echo('Sending current value: ' + currentValue + ' to ' + pushUrl);
            casperPush.open(pushUrl, {
                method: 'post',
                data: {
                    'value': currentValue
                }
            }).then(function() {
                    this.echo('Sent');
            });
        }
    }.bind(this);
    setInterval(sendCurrent, 1000);
}, function timeout() {}, 10000);

casperGoogle.run(function() {
    
});

casperPush.run(function() {
    
});