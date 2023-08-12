import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import './content-security-policy.js';

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

// Settings
// BrowserPolicy.content.allowEval()
// BrowserPolicy.framing.allowAll();
// BrowserPolicy.content.allowInlineScripts();
// BrowserPolicy.content.allowDataUrlForAll();
// BrowserPolicy.content.allowOriginForAll("jsdelivr.net");
// BrowserPolicy.content.allowOriginForAll("*.jsdelivr.net");
// BrowserPolicy.content.allowOriginForAll("volt.io");
// BrowserPolicy.content.allowOriginForAll("*.volt.io");
// BrowserPolicy.content.allowOriginForAll("*.*.volt.io");
// BrowserPolicy.content.allowOriginForAll("checkout.sandbox.volt.io");
// BrowserPolicy.content.allowFrameOrigin("volt.io");

Meteor.startup(async () => {

  // Set Access-Control-Allow-Origin
  WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    return next();
  });

  // If the Links collection is empty, add some data.
  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });
});
