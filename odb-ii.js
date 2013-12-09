Codes = new Meteor.Collection('codes');

function getMatches(query) {
    query = (query || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    var cursor;
    if (query) {
        cursor = Codes.find({
            code: new RegExp(query)
        }, {
            limit: 25
        });
    } else cursor = Codes.find({}, {
        limit: 1
    });
    return cursor;
}

if (Meteor.isClient) {

    Deps.autorun(function() {
        Meteor.subscribe('codes', Session.get('query'));
    });

    function updateQuery(event, template) {
        event.preventDefault();
        Session.set('query', template.find('.query').value);
    }

    Template.search.events({
        'keyup input': updateQuery,
        'submit form': updateQuery
    });

    Template.search.query = function() {
        return Session.get('query');
    };


    Template.results.codes = function() {
        var cursor = getMatches(Session.get('query'));
        Session.set('hasNoMatches', cursor.count() === 0);
        Session.set('hasOneMatch', cursor.count() === 1)
        return cursor;
    };

    Template.results.hasQuery = function() {
        return !!Session.get('query');
    };

    Template.results.hasNoMatches = function() {
        return Session.get('hasNoMatches');
    };
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
        if (Codes.find({}).count() === 0) {
            var data = JSON.parse(Assets.getText('odb-ii.json'));

            // todo: see if there's a better way to do this
            for (var i = 0; i < data.length; i++) {
                Codes.insert(data[i]);
            }
            console.log('seeded database with ' + i + ' rows');
        }

    });

    Meteor.publish('codes', getMatches);
}
