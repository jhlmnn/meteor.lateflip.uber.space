//
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import { KOBSessions } from './kob_sessions.collections.js';
import { Meteor } from 'meteor/meteor';

const session_life_time_seconds = 60 * 30; // 30 minutes

function findActiveSessions(client_id){
  return KOBSessions.find({
    client_id: client_id,
    // created_at > (now - session_life_time_seconds)
    created_at: { $gt: (new Date()).getTime() - (1000 * session_life_time_seconds) }
  });
}

function findActiveSessionById(client_id,session_id){
  return KOBSessions.findOne({
    client_id: client_id,
    session_id: session_id,
    // created_at > (now - session_life_time_seconds)
    created_at: { $gt: (new Date()).getTime() - (1000 * session_life_time_seconds) }
  });
}

/*

curl -X PUT \
  https://api.playground.openbanking.klarna.com/xs2a/v1/sessions \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 491' \
  -H 'Content-Type: application/json' \
  -H 'Host: api.playground.openbanking.klarna.com' \
  -H 'cache-control: no-cache' \
  -d '{
    "_language": "en",
    
    "selected_bank": {
        "bank_code": "88888888",
        "country_code": "DE"
    },
    
    "_aspsp_access": "force_psd2",
    "redirect_return_url": "http://localhost/auth",
    
    "psu": {
        "ip_address": "127.0.0.1",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"
    },
    
    "_keys": {
        "hsm": "xxx",
        "aspsp_data": "yyy"
    }
}'

*/

Meteor.methods({
  'kob.start_session'(client_id) {
    //
    let
      activeSessions = findActiveSessions(client_id);
    // start a new session
    if (activeSessions.count()<1){
      //
      console.debug("KOBSessions method kob.start_session: no active session found." );
      //
      try {
        let
          token = Meteor.settings.kob.token,
          result = HTTP.call(
          'PUT',
          'https://api.playground.openbanking.klarna.com/xs2a/v1/sessions',
          {
            headers: {
              "Accept": "*/*",
              "Authorization": "Bearer " + token,
              "Content-Type": "application/json"
            }
          }
        );
        /*

        HTTP 201 Created
        {
            "data": {
                "session_id": "9h92js1pv4uogde8nphcfrovr3qc9krc",
                "session_id_short": "9H92JSPV",
                "flows": {
                    "balances": "https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/9h92js1pv4uogde8nphcfrovr3qc9krc/flows/balances",
                    "transfer": "https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/9h92js1pv4uogde8nphcfrovr3qc9krc/flows/transfer",
                    "account_details": "https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/9h92js1pv4uogde8nphcfrovr3qc9krc/flows/account-details",
                    "accounts": "https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/9h92js1pv4uogde8nphcfrovr3qc9krc/flows/accounts",
                    "transactions": "https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/9h92js1pv4uogde8nphcfrovr3qc9krc/flows/transactions"
                },
                "self": "https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/9h92js1pv4uogde8nphcfrovr3qc9krc"
            }
        }

        HTTP 400 Bad request
        {
            "error": {
                "code": "badRequest",
                "message": "Selected bank not allowed for this user"
            }
        }

        */

        if (result.statusCode == 201){
          // Success
          let
            sessionId = result.data.data.session_id;
          KOBSessions.insert({
            "client_id": client_id,
            "session_id": sessionId,
            "session_id_short": result.data.data.session_id_short,
            "flows": Object.keys(result.data.data.flows),
            "created_at": (new Date()).getTime()
          });
          //
          console.debug("KOBSessions method kob.start_session: " + sessionId );
          //
          return sessionId;
        }
        if (result.statusCode == 400){
          // Error
          let
            errorCode = result.data.error.code,
            errorMessage = result.data.error.message;
          Meteor.Error("Session initialisation failed","Session could not be initialised. Response from API:\n" + errorCode + "\n" + errorMessage );
        }
        // Error return
        return -1;
      } catch(e) {
        throw(e);
      }
    } else {
      //
      console.debug("KOBSessions method kob.start_session: "+activeSessions.count()+" active sessions found." );
      //
      return activeSessions.fetch()[0].session_id;
    }
  },
  'kob.start_flow'(client_id,session_id,flow) {
    try {
      let
        token = Meteor.settings.kob.token,
        activeSession = findActiveSessionById(client_id,session_id);
      //
      console.log(activeSession);
      //
      if (!activeSession) {
        // No active session available
        console.debug("KOBSessions method kob.start_flow: no active session available.");
      } else if (activeSession && activeSession.flows.indexOf(flow) < 0) {
        // Flow not available
        console.debug("KOBSessions method kob.start_flow: flow not available.");
      } else {
        //
        result = HTTP.call(
          'PUT',
          'https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/'+session_id+'/flows/'+flow,
          {
            headers: {
              "Accept": "*/*",
              "Authorization": "Bearer " + token,
              "Content-Type": "application/json"
            }
          }
        );
        //
        if (result.statusCode == 201){
          return {
            'session_id': session_id,
            'client_token': result.data.data.client_token
          };
        } else {
          return -1;
        }
      }
    } catch(e){
      throw(e);
    }
  }
});
