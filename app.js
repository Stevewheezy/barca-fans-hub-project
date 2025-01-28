
const apiKey = 'AIzaSyC8yPGKwpOv665ipowl_8i0qXBLYNp1fJ0';
const barcaVideosSection = document.getElementById('barca-videos');

async function fetchBarcaVideos() {
  try {
    const channelId = 'UC1FCxn5XK8y8cOWbpsBpWeg'; // FC Barcelona YouTube channel ID
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      console.error('No videos found for FC Barcelona channel.');
      return;
    }

    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const thumbnail = item.snippet.thumbnails.default.url;

      const videoDiv = document.createElement('div');
      videoDiv.classList.add('video-item');

      videoDiv.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${thumbnail}" alt="${title}" />
          <p>${title}</p>
        </a>
      `;

      barcaVideosSection.appendChild(videoDiv);
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
}

fetchBarcaVideos();

// Football Fictures, League Table & Recent Results
const apiKey = '1e6b9984abc095b8bcd0838f25408a2f'; // Replace with your actual API key
const fixturesSection = document.getElementById('fixtures');
const resultsSection = document.getElementById('recent-results');
const standingsTable = document.getElementById('standings-table');
const standingsTableBody = document.getElementById('standings-table').getElementsByTagName('tbody')[0];

// Helper function to fetch data from API-Football
async function fetchData(endpoint) {
  const headers = {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  };

  try {
    const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/${endpoint}`, {
      headers: headers
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return empty array on error
  }
}

// Fetch and display upcoming fixtures
async function displayFixtures() {
  try {
    const fixtures = await fetchData('fixtures');
    fixtures.forEach(fixture => {
      const fixtureDiv = document.createElement('div');
      fixtureDiv.classList.add('fixture');
      fixtureDiv.innerHTML = `
        <p>${fixture.fixture.date} - ${fixture.teams.home.name} vs ${fixture.teams.away.name}</p>
      `;
      fixturesSection.appendChild(fixtureDiv);
    });
  } catch (error) {
    console.error('Error displaying fixtures:', error);
  }
}

// Fetch and display recent results
async function displayResults() {
  try {
    const results = await fetchData('fixtures?last=5'); 
    results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result');
      resultDiv.innerHTML = `
        <p>${result.fixture.date} - ${result.teams.home.name} ${result.goals.home} - ${result.goals.away} ${result.teams.away.name}</p>
      `;
      resultsSection.appendChild(resultDiv);
    });
  } catch (error) {
    console.error('Error displaying results:', error);
  }
}

// Fetch and display league standings
async function displayStandings() {
  try {
    const standings = await fetchData('league_table/1'); // Replace '1' with the actual league ID
    standings.forEach(team => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${team.position}</td>
        <td>${team.team.name}</td>
        <td>${team.points}</td>
        <td>${team.playedGames}</td>
      `;
      standingsTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error displaying standings:', error);
  }
}

// Call the functions to fetch and display data
displayFixtures();
displayResults();
displayStandings();

// Fetch news articles related to FC Barcelona
const apiKey = 'a144c03c658dcf5e1c5c9ba8edd31c1e'; 
const newsContainer = document.getElementById('news-container');

const fetchBarcelonaNews = async () => {
  try {
    const response = await fetch(`https://gnews.io/api/v4/search?q="FC Barcelona"&token=${apiKey}&lang=en&maxResults=5`);
    const data = await response.json();

    if (data.articles.length === 0) {
      newsContainer.innerHTML = '<p>No English news found for FC Barcelona.</p>';
      return;
    }

    data.articles.forEach(article => {
      const articleDiv = document.createElement('div');
      articleDiv.classList.add('article');

      if (article.image) { 
        const image = document.createElement('img');
        image.src = article.image; 
        image.alt = article.title;
        image.classList.add('thumbnail'); 
        articleDiv.appendChild(image);
      }

      const title = document.createElement('h3');
      title.textContent = article.title;

      const source = document.createElement('p');
      source.textContent = `Source: ${article.source.name}`;

      const link = document.createElement('a');
      link.href = article.url;
      link.textContent = 'Read More';
      link.target = '_blank';

      articleDiv.appendChild(title);
      articleDiv.appendChild(source);
      articleDiv.appendChild(link);

      newsContainer.appendChild(articleDiv);
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>Failed to load news.</p>';
  }
};

fetchBarcelonaNews();
