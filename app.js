

const API_KEY = 'AIzaSyBaCC7YwtnNW71endAk99wQh9xul3xhXP8'; // Replace with your YouTube API key

// Channel IDs
const BARCA_CHANNEL_ID = 'UC14UlmYlSNiQCBe9Eookf_A';

// Number of videos to fetch from each channel
const MAX_RESULTS = 3;

// Fetch videos from YouTube for a specific channel
async function fetchYouTubeVideos(channelId) {
  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=${MAX_RESULTS}&order=date&key=${API_KEY}`;
  
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.items) {
      return data.items; // Return the list of videos
    } else {
      console.error('No videos found:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

// Display videos in the gallery
function displayVideos(videos, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous content

  videos.forEach((video) => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;

    // Create video card
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
        <img src="${thumbnail}" alt="${title}" />
        <h3>${title}</h3>
      </a>
    `;

    container.appendChild(videoCard);
  });
}

// Main function to fetch and display videos
async function loadVideos() {
  const barcaVideos = await fetchYouTubeVideos(BARCA_CHANNEL_ID);
  
  // Display videos in respective sections
  displayVideos(barcaVideos, 'barca-videos');
}

// Call the main function on page load
loadVideos();

// Football Fictures, League Table & Recent Results
const FOOTBALL_API_KEY = '285d8724ae01f5f64f3ed941d96da402'; // Replace with your Football API key
const FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';
const TEAM_ID = 529; // Barcelona's Team ID
const LEAGUE_ID = 140; // La Liga's League ID
const SEASON = 2024; // Current Season

// Function to fetch upcoming fixtures
async function fetchFixtures(teamId, leagueId, season) {
  const endpoint = `${FOOTBALL_BASE_URL}/fixtures?team=${teamId}&league=${leagueId}&season=${season}&next=5`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'x-rapidapi-key': FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });
    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
}

// Function to fetch recent results
async function fetchResults(teamId, leagueId, season) {
  const endpoint = `${FOOTBALL_BASE_URL}/fixtures?team=${teamId}&league=${leagueId}&season=${season}&last=5`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'x-rapidapi-key': FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });
    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
}

// Function to fetch league standings
async function fetchStandings(leagueId, season) {
  const endpoint = `${FOOTBALL_BASE_URL}/standings?league=${leagueId}&season=${season}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'x-rapidapi-key': FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });
    const data = await response.json();
    return data.response[0].league.standings[0] || [];
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
}

// Function to display fixtures
function displayFixtures(fixtures, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous content

  fixtures.forEach((fixture) => {
    const match = document.createElement('div');
    match.className = 'fixture';
    match.innerHTML = `
      <p><strong>${fixture.teams.home.name}</strong> vs <strong>${fixture.teams.away.name}</strong></p>
      <p>${new Date(fixture.fixture.date).toLocaleString()}</p>
    `;
    container.appendChild(match);
  });
}

// Function to display results
function displayResults(results, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous content

  results.forEach((result) => {
    const match = document.createElement('div');
    match.className = 'result';
    match.innerHTML = `
      <p><strong>${result.teams.home.name}</strong> ${result.score.fulltime.home} - ${result.score.fulltime.away} <strong>${result.teams.away.name}</strong></p>
    `;
    container.appendChild(match);
  });
}

// Function to display league standings
function displayStandings(standings, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous content

  standings.forEach((team, index) => {
    const standing = document.createElement('div');
    standing.className = 'standing';
    standing.innerHTML = `
      <p><strong>${index + 1}. ${team.team.name}</strong> - ${team.points} points</p>
      <p>Played: ${team.all.played}, Won: ${team.all.win}, Drawn: ${team.all.draw}, Lost: ${team.all.lose}</p>
    `;
    container.appendChild(standing);
  });
}

// Main function to load all data
async function loadFootballData() {
  const fixtures = await fetchFixtures(TEAM_ID, LEAGUE_ID, SEASON);
  const results = await fetchResults(TEAM_ID, LEAGUE_ID, SEASON);
  const standings = await fetchStandings(LEAGUE_ID, SEASON);

  // Display data in respective sections
  displayFixtures(fixtures, 'fixtures');
  displayResults(results, 'recent-results');
  displayStandings(standings, 'league-standings');
}

// Call the main function on page load
loadFootballData();
