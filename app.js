

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
