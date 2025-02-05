const apiKey = 'a144c03c658dcf5e1c5c9ba8edd31c1e';
const newsList = document.getElementById('news-list');

async function fetchBarcelonaNews() {
  try {
    newsList.innerHTML = "<p>Loading news...</p>"; // Show loading text
    const response = await fetch(`https://gnews.io/api/v4/search?token=${apiKey}&q="FC Barcelona"&lang=en`);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      newsList.innerHTML = ""; // Clear old news
      const articles = data.articles.slice(0, 10); // Limit to 10 articles

      articles.forEach(article => {
        const listItem = document.createElement('li');
        listItem.classList.add('article');

        const link = document.createElement('a');
        link.href = article.url;
        link.target = "_blank";

        const image = document.createElement('img');
        image.src = article.image || 'placeholder.jpg';
        image.alt = article.title;

        const title = document.createElement('h3');
        title.textContent = article.title;

        const description = document.createElement('p');
        description.textContent = article.description;

        link.appendChild(image);
        link.appendChild(title);
        link.appendChild(description);
        listItem.appendChild(link);

        newsList.appendChild(listItem); 
      });
    } else {
      newsList.innerHTML = '<p>No FC Barcelona news articles found.</p>';
    }
  } catch (error) {
    console.error('Error fetching FC Barcelona news:', error);
    newsList.innerHTML = '<p>Error loading FC Barcelona news.</p>';
  }
}

// Fetch news every 5 minutes (300,000 ms)
fetchBarcelonaNews();
setInterval(fetchBarcelonaNews, 300000);


// Fan Zone Section
const fanForm = document.getElementById('fan-form');
const fanInput = document.getElementById('fan-input');
const commentsList = document.getElementById('comments-list');

// Load existing comments from localStorage
function loadComments() {
  commentsList.innerHTML = ""; // Clear before loading
  const comments = JSON.parse(localStorage.getItem('fanComments')) || [];
  
  comments.forEach(comment => {
    const listItem = document.createElement('li');
    listItem.textContent = comment;
    commentsList.appendChild(listItem);
  });
}

// Save a new comment
fanForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const comment = fanInput.value.trim();
  if (comment) {
    let comments = JSON.parse(localStorage.getItem('fanComments')) || [];
    comments.push(comment);
    localStorage.setItem('fanComments', JSON.stringify(comments));

    fanInput.value = ""; // Clear input
    loadComments(); // Reload comments
  }
});

// Load comments when page loads
loadComments();
