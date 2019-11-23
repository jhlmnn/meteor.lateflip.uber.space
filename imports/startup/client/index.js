// Import client startup through a single index entry point
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import './routes.js';

Meteor.startup(() => {
  Meteor.call('client_sessions.start_session', (error,result) => {
    if (result){
      // Set the client_id for this session
      Session.set("client_id",result);
    }
  })
});
