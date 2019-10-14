/**
 * In this file we have our 'custom' service worker work.
 * WebPack uses GenerateSW from the Workbox plugin to generate sw.js. This sw.js is loaded from our index.html
 *
 * We want to display a warning message when the user has gone offline and does an api call.
 */
const { strategies } = workbox;
const handler = async ({ url, event }) => {
  try {
    return await strategies.networkOnly().handle({ event });
  } catch (error) {
    //Show warning message that there is no internet connectivity.
    this.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage('NoConnection'));
    });
  }
};

/**
 * Register the API routes. API calls should never be cached. So use a network only strategy. And if no connection. Show error message to the user.
 */
workbox.routing.registerRoute(
  new RegExp('(.+/person)|(.+/address/.+)|(.+/familyfirstgrade)'),
  handler
);
workbox.routing.registerRoute(
  new RegExp('(.+/order)|(.+/jwt/.+)'),
  handler,
  'POST'
);
