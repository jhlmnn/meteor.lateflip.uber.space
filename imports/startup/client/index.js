// Import client startup through a single index entry point
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import './routes.js';

Meteor.startup(() => {
  //
  if (localStorage["client_id"]==undefined) {
    Meteor.call('client_sessions.start_session', (error,result) => {
      if (result){
        // Set the client_id for this session
        localStorage["client_id"] = result;
        Session.set("client_id",result);
      }
    });
  } else {
    Session.set("client_id",localStorage["client_id"]);
  }
});
