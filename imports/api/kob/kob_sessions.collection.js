//
import { Mongo } from 'meteor/mongo';

/*

KOBSessions
{
  "client_id"
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "session_id_short": "9H92JSPV",
  "flows": ["balances","transfer","account_details","accounts","transactions"]
  "created_at": "", // when the session with started
}

*/
export const KOBSessions = new Mongo.Collection('kob_sessions');
