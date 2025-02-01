const apiKey = 'a144c03c658dcf5e1c5c9ba8edd31c1e';
const newsList = document.getElementById('news-list');

async function fetchBarcelonaNews() {
  try {
    const response = await fetch(`https://gnews.io/api/v4/search?token=${apiKey}&q="FC Barcelona"&lang=en`);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      const articles = data.articles.slice(0, 10); // Limit to 10 articles

      articles.forEach(article => {
        const listItem = document.createElement('li');
        listItem.classList.add('article'); // Use 'article' class for styling

        const link = document.createElement('a');
        link.href = article.url;
        link.target = "_blank";

        const image = document.createElement('img');
        image.src = article.image || 'placeholder.jpg'; // Use placeholder image if no image available
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

fetchBarcelonaNews();