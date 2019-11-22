import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

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
  'kob.start_session'() {
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
        let
          sessionId = result.data.data.session_id;
        //console.log("KOB session_id: "+sessionId);
        return sessionId;
      }
      if (result.statusCode == 400){
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
  },
  'kob.accounts'() {
    try {
      let
        sessionId = Meteor.call('kob.start_session'),
        token = Meteor.settings.kob.token;
      
      result = HTTP.call(
        'PUT',
        'https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/'+sessionId+'/flows/accounts',
        {
          headers: {
            "Accept": "*/*",
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          }
        }
      );

      if (result.statusCode == 201){
        let
          clientToken = result.data.data.client_token;
        return {
          'session_id': sessionId,
          'client_token': clientToken
        };
      } else {
        return -1;
      }
    } catch(e){
      throw(e);
    }
  }
});
