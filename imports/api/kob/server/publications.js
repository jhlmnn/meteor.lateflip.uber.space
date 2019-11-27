//
import { Meteor } from 'meteor/meteor';
import { KOBSessions } from '../kob_sessions.collections.js';

/*

KOBSessions
{
  "client_id"
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "session_id_short": "9H92JSPV",
  "created_at": "", // when the session with started
}

*/

Meteor.publish('kob_sessions.all', function () {
  return KOBSessions.find();
});

Meteor.publish('kob_sessions.active', function (client_id) {
  return findActiveSessions(client_id);
});
