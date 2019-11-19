import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

/*

curl -X PUT \
  https://api.playground.openbanking.klarna.com/xs2a/v1/sessions \
  -H 'Authorization: Bearer MTU4MzI3ODAxMHx8fGYyNjMxZTE1LTQ5MzQtNDkwYy05OGFiLTYwOWVjMDRhN2FkMXx8fDExMjV8fHxyaXZlcmJhbmsuKg==.0/t4uoDqwv+JjN55BKrVuwZfjtelRXopzY+YXPhBAmw=' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 491' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: kdid=1f88369f-a0d8-48fd-82c9-74adf7a2edd3' \
  -H 'Host: api.playground.openbanking.klarna.com' \
  -H 'Postman-Token: 20d64789-fe95-4764-80be-ebbec1e528d4,b2e1a44c-c178-4608-a1f3-02e80063541e' \
  -H 'User-Agent: PostmanRuntime/7.19.0' \
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
      let result = HTTP.call(
        'PUT',
        'https://api.playground.openbanking.klarna.com/xs2a/v1/sessions',
        {
          headers: {
            "Accept": "*/*",
            "Authorization": "Bearer MTU4MzI3ODAxMHx8fGYyNjMxZTE1LTQ5MzQtNDkwYy05OGFiLTYwOWVjMDRhN2FkMXx8fDExMjV8fHxyaXZlcmJhbmsuKg==.0/t4uoDqwv+JjN55BKrVuwZfjtelRXopzY+YXPhBAmw=",
            "Content-Type": "application/json"
          }
        }
      );

      if (result.statusCode == 201){
        let
          sessionId = result.data.data.session_id;
        //console.log("KOB session_id: "+sessionId);
        return sessionId;
      }
      // Error return
      return -1;
    } catch(e) {
      throw(e);
    } 
  },
  'kob.accounts'() {
    try {
      let sessionId = Meteor.call('kob.start_session');
      
      result = HTTP.call(
        'PUT',
        'https://api.playground.openbanking.klarna.com/xs2a/v1/sessions/'+sessionId+'/flows/accounts',
        {
          headers: {
            "Accept": "*/*",
            "Authorization": "Bearer MTU4MzI3ODAxMHx8fGYyNjMxZTE1LTQ5MzQtNDkwYy05OGFiLTYwOWVjMDRhN2FkMXx8fDExMjV8fHxyaXZlcmJhbmsuKg==.0/t4uoDqwv+JjN55BKrVuwZfjtelRXopzY+YXPhBAmw=",
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
