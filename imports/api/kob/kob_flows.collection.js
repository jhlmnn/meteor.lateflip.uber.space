//
import { Mongo } from 'meteor/mongo';

/*

KOBFlows
{
  "client_id"
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "flow": "balances",
  "created_at": "", // when the session with started
}

*/
export const KOBFlows = new Mongo.Collection('kob_flows');
