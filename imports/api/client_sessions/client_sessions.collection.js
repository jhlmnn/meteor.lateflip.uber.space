//
import { Mongo } from 'meteor/mongo';

/*

KOBSessions
{
  "_id": "",
  "state": ["ACTIVE"|"CLOSED"],
  "created_at": "1574548995446" // timestamp
}

*/
export const ClientSessions = new Mongo.Collection('client_sessions');
