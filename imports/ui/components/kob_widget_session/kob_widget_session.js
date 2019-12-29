import './kob_widget_session.html';
import '../../stylesheets/body.css';

Template.kob_widget_session.onCreated(function kob_widget_sessionOnCreated() {
  //
  //
  //
  console.debug("kob_widget_sessionOnCreated()");
  //
  this.session_id = new ReactiveVar('(no session available)');
  this.client_token = new ReactiveVar('(no session available)');
  this.kob_session = new ReactiveVar('(no session available)');
  //
  var configureXS2A = function(XS2A){
    // configure once for all flows (optional)
    console.debug("XS2A: configure once for all flows.");
    //
    XS2A.configure({
      autoClose: true,
      hideTransitionOnFlowEnd: true,
      onLoad: () => {
          console.log('onLoad called')
      },
      onReady: () => {
          console.log('onReady called')
      },
      onAbort: () => {
          console.log('onAbort called')
      },
      onError: (error) => {
          console.log('onError called', error)
      },
      onFinished: () => {
          console.log('onFinished called')
      },
      onClose: () => {
          console.log('onClose called')
      }
    });
  };
  //
  if (window.XS2A) {
    configureXS2A(window.XS2A);
  } else {
    window.onXS2AReady = (XS2A) => { configureXS2A(XS2A) };
  }
  //
  //
  //
});

Template.kob_widget_session.helpers({
  client_id(){
    return Session.get("client_id");
  },
  session_id(){
    return Template.instance().session_id.get();
  },
  client_token(){
    return Template.instance().client_token.get();
  },
  kob_session(){
    return Template.instance().kob_session.get();
  }
});

Template.kob_widget_session.events({
  'click button.reset_client'(event,instance){
    localStorage.removeItem("client_id");
    Session.set("client_id","");
  },
  'click button.kob_init_session'(event, instance) {
    //
    try {
      Meteor.call('kob.start_session',Session.get("client_id"), (error,result) => {
        let
          KOB_sessionObject = result,
          KOB_sessionId = result.session_id;
        //
        console.log(result);
        //
        instance.kob_session.set(KOB_sessionObject);
        instance.session_id.set(KOB_sessionId);
      });
    } catch (e) {
      //
      console.log(e);
      //
    }
    //
  },
  'click button.kob_init_flow'(event, instance) {
    //
    let
      KOB_sessionId = instance.session_id.get(),
      KOB_flow = Session.get("selected_flow");
    //
    if (KOB_flow==undefined){
      // No flow selected
      alert("No flow selected");
      return -1;
    }
    //
    try {
      //
      // Save the client_token
      //
      Meteor.call('kob.start_flow',Session.get("client_id"),KOB_sessionId,KOB_flow, (error,result) => {
        //
        console.log(result);
        //
        instance.client_token.set(result.client_token);
      });
    } catch (e) {
      console.log(e);
    }
  },
  'click button.kob_start_flow'(event, instance) {
    //
    let
      KOB_client_token = instance.client_token.get(),
      KOB_flow = Session.get("selected_flow");
    //
    if (KOB_flow==undefined){
      // No flow selected
      alert("No flow selected");
      return -1;
    }
    //
    console.debug("KOB start flow: " + KOB_flow );
    //
    try {
      //
      // Start flow
      //
      window.XS2A.startFlow(KOB_client_token);
    } catch (e) {
      console.log(e);
    }
  },
  'change select[name="flow"]'(event,instance){
    Session.set("selected_flow",event.target.value);
  }
});
