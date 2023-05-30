document.addEventListener('DOMContentLoaded', async () => {
  const subscribedFeedsList = document.getElementById('subscribed-feeds-list');
  const readFeedsList = document.getElementById('read-feeds-list');
  const unreadFeedsList = document.getElementById('unread-feeds-list');

  // Fetch subscribed feeds
  const subscribedFeeds = await fetchFeeds('/subscribed-feeds');
  renderFeeds(subscribedFeeds, subscribedFeedsList);

  // Fetch read feeds
  const readFeeds = await fetchFeeds('/read-feeds');
  renderFeeds(readFeeds, readFeedsList);

  // Fetch unread feeds
  const unreadFeeds = await fetchFeeds('/unread-feeds');
  renderFeeds(unreadFeeds, unreadFeedsList);
});

async function fetchFeeds(endpoint) {
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

function renderFeeds(feeds, container) {
  feeds.forEach(feed => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <a href="${feed.link}">${feed.title}</a>
    `;
    container.appendChild(listItem);
  });
}
