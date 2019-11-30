//
import { Meteor } from 'meteor/meteor';
import { KOBSessions } from '../kob_sessions.collections.js';
import { KOBFlows } from '../kob_flows.collection.js';

/*

KOBSessions
{
  "client_id"
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "session_id_short": "9H92JSPV",
  "flows": ["balances","transfer","account_details","accounts","transactions"]
  "created_at": "", // when the session with started
}

KOBFlows
{
  "client_id"
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "flow": "balances",
  "created_at": "", // when the session with started
  "state": enum<"INITIALIZED", "PROCESSING", "CONSUMER_INPUT_NEEDED", "FINISHED", "INTERRUPTED",  "ABORTED", "EXCEPTION">,
}

*/

Meteor.publish('kob_sessions.active', function (client_id) {
  return findActiveSessions(client_id);
});

Meteor.publish('kob_flows.active',function(client_id,session_id){
  return KOBFlows.findOne({
    client_id: client_id,
    session_id: session_id,
    state: { $in: ["INITIALIZED", "PROCESSING", "CONSUMER_INPUT_NEEDED"] }
  })
});