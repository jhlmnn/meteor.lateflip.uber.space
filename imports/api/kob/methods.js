//
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import { KOBSessions, findActiveSessions, findActiveSessionById } from './kob_sessions.collection.js';
import { KOBFlows, findActiveFlow } from './kob_flows.collection.js';

const token = Meteor.settings.kob.token;

Meteor.methods({
  'kob.start_session'(client_id) {
    //
    let
      activeSessions = findActiveSessions(client_id);
    //
    if (activeSessions.count()<1){
      // No active session found, starting a new session
      console.debug("Method kob.start_session: start a new session." );
      //
      try {
        let
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
        //
        console.debug(result.data);
        //
        if (result.statusCode == 201){
          // Success
          let
            sessionId = result.data.data.session_id,
            sessionObject = {
              "client_id": client_id,
              "session_id": sessionId,
              "session_id_short": result.data.data.session_id_short,
              "flows": Object.keys(result.data.data.flows),
              "created_at": (new Date()).getTime()
            };
          //
          KOBSessions.insert(sessionObject);
          //
          console.debug("Method kob.start_session: session created session_id: " + sessionId );
          //
          return sessionObject;
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
      console.debug("Method kob.start_session: " + activeSessions.count() + " active sessions found session_id: " + activeSessions.fetch()[0].session_id );
      //
      return activeSessions.fetch()[0];
    }
  },
  'kob.start_flow'(client_id,session_id,flow) {
    //
    let activeSession = findActiveSessionById(client_id,session_id);
    //
    if (!activeSession) {
      // No active session available
      console.debug("Method kob.start_flow: no active session available.");
      //
    } else if (activeSession && activeSession.flows.indexOf(flow) < 0) {
      // Flow not available
      console.debug("Method kob.start_flow: flow not available.");
      //
    } else {
      //
      let activeFlow = findActiveFlow(client_id,session_id);
      //
      if (activeFlow==undefined){
        //
        console.debug("Method kob.start_flow: start a new flow.");
        //
        try {
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
          console.log(result);
          //
          if (result.statusCode == 201){
            // Success
            let
              flowId = result.data.data.flow_id,
              clientToken = result.data.data.client_token,
              flowObject = {
                "client_id": client_id,
                "session_id": session_id,
                "flow_id": flowId,
                "flow": flow,
                "client_token": result.data.data.client_token,
                "created_at": (new Date()).getTime()
              };
            //
            KOBFlows.insert(flowObject);
            //
            console.debug("Method kob.start_flow: " + flowId );
            //
            return flowObject;
          } else {
            return -1;
          }
        } catch(e) {
          // Error: failed [409] {"error":{"code":"CONFLICT","message":"A new flow cannot be started for session with the provided id as long as there is a running flow"}}
          console.debug("Error: " + e);
          //
          throw(e);
        }
      } else {
        //
        console.debug("Method kob.start_session: active flow found flow_id: " + activeFlow.flow_id );
        //
        return activeFlow;
      }
    }
  }
});
