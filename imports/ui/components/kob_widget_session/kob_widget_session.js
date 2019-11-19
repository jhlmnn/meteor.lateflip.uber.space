import './kob_widget_session.html';
import '../../stylesheets/body.css';

Template.kob_widget_session.onCreated(function kob_widget_sessionOnCreated() {
  this.session_id = new ReactiveVar('...loading...');
  this.client_token = new ReactiveVar('...loading...');
  //
  Meteor.call('kob.accounts', (error,result) => {
    this.session_id.set(result.session_id);
    this.client_token.set(result.client_token);
  });
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
      // override parts of the configuration just for this flow
      window.XS2A.startFlow(
        instance.client_token.get(),
        {
          onLoad: () => { console.log('onLoad called #2') }
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
});
