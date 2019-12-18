//
import { Mongo } from 'meteor/mongo';

const flow_life_time_seconds = 60 * 30; // 30 minutes

export const KOBFlows = new Mongo.Collection('kob_flows');

/*

KOBFlows
{
  "client_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "flow_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
  "flow": "balances",
  "client_token": "eyU...das",
  "created_at": 1576702614553
}

*/

export function findActiveFlow(client_id,session_id){
  //
  console.debug("findActiveFlow client_id: " + client_id + " session_id: " + session_id);
  //
  console.debug( KOBFlows.find().fetch() );
  //
  return KOBFlows.findOne({
    'client_id': client_id,
    'session_id': session_id,
    'created_at': { $gt: (new Date()).getTime() - (1000 * flow_life_time_seconds) }
  });
}
