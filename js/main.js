document.addEventListener('DOMContentLoaded', () => {
    const feedList = document.getElementById('feedList');
  
    // Fetch and display the RSS feeds
    fetch('/feeds')
      .then((response) => response.json())
      .then((data) => {
        data.forEach((feed) => {
          const item = document.createElement('li');
          item.innerHTML = `
            <a href="${feed.link}" target="_blank" rel="noopener noreferrer">${feed.title}</a>
          `;
          feedList.appendChild(item);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
    // Mark a feed item as read
    function markAsRead(title, link) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ title, link }),
      };
  
      fetch('/mark-read', requestOptions)
        .then((response) => {
          if (response.status === 200) {
            console.log(`Marked as read: ${title}`);
          } else {
            console.error(`Failed to mark as read: ${title}`);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  
    // Add click event listener to mark items as read
    feedList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        const title = event.target.innerText;
        const link = event.target.href;
  
        markAsRead(title, link);
      }
    });
  });
  