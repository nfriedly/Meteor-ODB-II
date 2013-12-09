Codes = new Meteor.Collection("codes");

if (Meteor.isClient) {
  Template.results.codes = function () {
    var query = Session.get("query")
    // todo: figure out if there's a better way to do this
    var search = (query && query.length > 3) ? {$where: function() {
        return this.code.indexOf(query) != -1;
    }} : {}
    return Codes.find(search);
  };
  
  function updateQuery(event,template) {
    event.preventDefault();
    Session.set("query", template.find(".query").value.toUpperCase());
  }
  
  Template.search.events({
    'keyup input': updateQuery,
    "submit form": updateQuery
  });
  
  Template.search.query = function() {
    return Session.get("query") || "";
  }
  
  Template.results.isMatch = function() {
    return Template.results.codes().count() != 0;
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Codes.find({}).count() === 0) {
        var data = JSON.parse(Assets.getText("odb-ii.json"));
        
        // todo: see if there's a better way to do this
        for (var i = 0; i < data.length; i++) {
            Codes.insert(data[i]);
        }
        console.log("seeded database with " + i + " rows");
    }

  });
}
