import './kob_widget_session.html';
import '../../stylesheets/body.css';

Template.kob_widget_session.onCreated(function kob_widget_sessionOnCreated() {
  this.session_id = new ReactiveVar('(no session available)');
  this.client_token = new ReactiveVar('(no session available)');
  //
  //
  //
  window.onXS2AReady = (XS2A) => {
    // configure once for all flows (optional)
    window.XS2A.configure({
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
    })
  };
  //
  //
  //
});

Template.kob_widget_session.helpers({
  session_id() {
    return Template.instance().session_id.get();
  },
  client_token() {
    return Template.instance().client_token.get();
  }
});

Template.kob_widget_session.events({
  'click button'(event, instance) {
    try {
      //
      Meteor.call('kob.accounts', (error,result) => {
        instance.session_id.set(result.session_id);
        instance.client_token.set(result.client_token);
        // override parts of the configuration just for this flow
        window.XS2A.startFlow(
          instance.client_token.get(),
          {
            onLoad: () => { console.log('onLoad called #2') }
          }
        );
      });
    } catch (e) {
      console.log(e);
    }
  },
});
