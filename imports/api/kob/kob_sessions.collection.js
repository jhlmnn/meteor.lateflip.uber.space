//
import { Mongo } from 'meteor/mongo';

const session_life_time_seconds = 60 * 30; // 30 minutes

export const KOBSessions = new Mongo.Collection('kob_sessions');

/*

KOBSessions
{
  "client_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "session_id_short": "9H92JSPV",
  "flows": ["balances","transfer","account_details","accounts","transactions"]
  "created_at": 1576702614553
}

*/

export function findActiveSessions(client_id){
  //
  console.debug("findActiveSessions client_id: " + client_id);
  //
  return KOBSessions.find({
    'client_id': client_id,
    // created_at > (now - session_life_time_seconds)
    'created_at': { $gt: (new Date()).getTime() - (1000 * session_life_time_seconds) }
  });
}

export function findActiveSessionById(client_id,session_id){
  //
  console.debug("findActiveSessionById client_id: " + client_id + " session_id: " + session_id);
  //
  return KOBSessions.findOne({
    'client_id': client_id,
    'session_id': session_id,
    // created_at > (now - session_life_time_seconds)
    'created_at': { $gt: (new Date()).getTime() - (1000 * session_life_time_seconds) }
  });
}
