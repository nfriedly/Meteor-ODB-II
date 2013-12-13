casper.test.begin('ODB-II integration testing', 7, {

    setUp: function(test) {
    },

    tearDown: function(test) {
    },

    test: function suite(test) {
        casper.start("http://localhost:3000/", function() {
            test.assertTitle("Look up ODB-II diagnostic codes", "page title");
        });

        casper.then(function() {
            test.assertExists('input[name="odb-ii-code"]', "main input found");
        });

        // partial code that matches many items
        casper.then(function() {
            this.fillSelectors('form', {
                'input[name="odb-ii-code"]':    'P1'
            }, true);
            casper.waitForSelector('ul.results li', function() {
                test.assertElementCount('ul.results li', 25, "a partial input that matches many codes should show 25 results");
            });
        });
        
        // blank form
        casper.then(function() {
            this.fillSelectors('form', {
                'input[name="odb-ii-code"]':    ''
            }, true);
            casper.waitWhileSelector('ul.results li');
        });

        // complete code that matches one item
        casper.then(function() {
            this.fillSelectors('form', {
                'input[name="odb-ii-code"]':    'P1566'
            }, true);
            casper.waitForSelector('ul.results li', function() {
                test.assertElementCount('ul.results li', 1, "A complete code should result in exactly one match");
                test.assertTextExists("Cruise Control System-Engine RPM Too High", "The site should display the correct explanation text");
            });
        });

        // non-matching gibberish
        casper.then(function() {
            this.fillSelectors('form', {
                'input[name="odb-ii-code"]':    'asdfasdfasdf'
            }, true);
            casper.waitForSelector('div.alert', function() {
                test.assertElementCount('ul.results li', 0, "There should be no codes shown for non-matching input");
                test.assertTextExists("No matching codes found.", "The site should explain that there are no matching codes");
            });
        });

        casper.run(function() {
            test.done();
        });
    }

});