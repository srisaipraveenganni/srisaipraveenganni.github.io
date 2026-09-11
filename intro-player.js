(() => {
  const video = document.getElementById('intro-video-player');
  const audio = document.getElementById('intro-audio-player');
  const button = document.getElementById('play-intro-sound');
  const status = document.getElementById('intro-playback-status');
  const fallback = document.getElementById('intro-audio-option');
  if (!video || !audio || !button || !status || !fallback) return;

  const audible = () => !video.muted && video.volume > 0;
  const updateButton = () => {
    button.textContent = !video.paused && !video.ended
      ? (audible() ? 'Pause introduction' : 'Turn sound on')
      : (video.currentTime > 0 && !video.ended ? 'Resume with sound' : 'Play with sound');
  };
  const showFailure = () => {
    fallback.open = true;
    status.textContent = 'The video could not play. Try the audio player below or open the video in a new tab.';
    updateButton();
  };

  button.addEventListener('click', async () => {
    if (!video.paused && !video.ended && audible()) {
      video.pause();
      status.textContent = 'Introduction paused.';
      return;
    }
    audio.pause();
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    if (video.ended) video.currentTime = 0;
    status.textContent = 'Starting introduction with sound…';
    // Call play directly in the click handler to preserve the browser's user gesture.
    try {
      await video.play();
    } catch {
      showFailure();
    }
    updateButton();
  });

  video.addEventListener('play', () => { audio.pause(); updateButton(); });
  video.addEventListener('playing', () => {
    status.textContent = audible()
      ? 'Playing with sound. You can adjust the volume in the player.'
      : 'Video is muted. Select Turn sound on to hear the narration.';
    updateButton();
  });
  video.addEventListener('pause', updateButton);
  video.addEventListener('ended', () => {
    status.textContent = 'Introduction finished. Select Play with sound to watch again.';
    updateButton();
  });
  video.addEventListener('volumechange', () => {
    if (!video.paused && !video.ended) {
      status.textContent = audible() ? 'Playing with sound.' : 'Video is muted. Select Turn sound on to hear the narration.';
    }
    updateButton();
  });
  video.addEventListener('error', showFailure);

  audio.addEventListener('play', () => {
    video.pause();
    audio.muted = false;
    audio.volume = 1;
    updateButton();
  });
  audio.addEventListener('playing', () => { status.textContent = 'Playing the audio introduction.'; });
  audio.addEventListener('ended', () => { status.textContent = 'Audio introduction finished.'; });
  audio.addEventListener('error', () => {
    status.textContent = 'The audio could not load. Use Open audio below to try it directly.';
  });
  updateButton();
})();
