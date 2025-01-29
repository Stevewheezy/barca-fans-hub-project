// API keys
const footballApiKey = '1e6b9984abc095b8bcd0838f25408a2f'; // API-Football
const newsApiKey = 'a144c03c658dcf5e1c5c9ba8edd31c1e'; // GNews

// HTML elements
const fixturesSection = document.getElementById('fixtures');
const resultsSection = document.getElementById('recent-results');
const standingsTableBody = document.getElementById('standings-table').getElementsByTagName('tbody')[0];
const newsContainer = document.getElementById('news-container');

// Helper function to fetch data from API-Football
async function fetchFootballData(endpoint) {
  const headers = {
    'x-rapidapi-key': footballApiKey,
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  };

  try {
    const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/${endpoint}`, {
      headers: headers
    });
    if (!response.ok) throw new Error(`Football API Error: ${response.status}`);
    const data = await response.json();
    return data.response || []; // Return empty array if response is undefined
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return []; // Fail gracefully
  }
}

// Fetch news articles related to FC Barcelona
async function fetchBarcelonaNews() {
  try {
    const response = await fetch(`https://gnews.io/api/v4/search?q="FC Barcelona"&token=${newsApiKey}&lang=en&maxResults=5`);
    if (!response.ok) throw new Error(`News API Error: ${response.status}`);
    const data = await response.json();
    return data.articles || []; // Return empty array if no articles found
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Render functions
function renderFixtures(fixtures) {
  if (fixtures.length === 0) {
    fixturesSection.innerHTML = '<p>No upcoming fixtures found.</p>';
    return;
  }

  fixtures.forEach(fixture => {
    const fixtureDiv = document.createElement('div');
    fixtureDiv.classList.add('fixture');
    fixtureDiv.innerHTML = `<p>${fixture.fixture.date} - ${fixture.teams.home.name} vs ${fixture.teams.away.name}</p>`;
    fixturesSection.appendChild(fixtureDiv);
  });
}

function renderResults(results) {
  if (results.length === 0) {
    resultsSection.innerHTML = '<p>No recent results found.</p>';
    return;
  }

  results.forEach(result => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultDiv.innerHTML = `<p>${result.fixture.date} - ${result.teams.home.name} ${result.goals.home} - ${result.goals.away} ${result.teams.away.name}</p>`;
    resultsSection.appendChild(resultDiv);
  });
}

function renderStandings(standings) {
  if (standings.length === 0) {
    standingsTableBody.innerHTML = '<tr><td colspan="4">No standings available.</td></tr>';
    return;
  }

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
}

function renderNews(articles) {
  if (articles.length === 0) {
    newsContainer.innerHTML = '<p>No news available.</p>';
    return;
  }

  articles.forEach(article => {
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
}

// Use Promise.all to fetch everything in parallel
async function fetchAllData() {
  try {
    const [fixtures, results, standings, news] = await Promise.allSettled([
      fetchFootballData('fixtures'),
      fetchFootballData('fixtures?last=5'),
      fetchFootballData('standings?league=1&season=2023'), // Adjust league ID and season
      fetchBarcelonaNews()
    ]);

    // Process each API response independently
    if (fixtures.status === 'fulfilled') renderFixtures(fixtures.value);
    if (results.status === 'fulfilled') renderResults(results.value);
    if (standings.status === 'fulfilled') renderStandings(standings.value);
    if (news.status === 'fulfilled') renderNews(news.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch all data
fetchAllData();
