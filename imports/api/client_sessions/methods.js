import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import { ClientSessions } from './client_sessions.collection.js';

Meteor.methods({
  'client_sessions.start_session'() {
    // Insert the session 
    return ClientSessions.insert({
      state: "ACTIVE",
      created_at: (new Date()).getTime(),
    });
  }
});
