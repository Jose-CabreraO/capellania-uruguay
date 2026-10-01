// Large play button over the poster. Playback only ever starts from a user click;
// without JavaScript the native controls remain fully usable.
(() => {
  document.querySelectorAll('[data-video]').forEach(figure => {
    const video = figure.querySelector('[data-video-player]');
    const button = figure.querySelector('[data-video-play]');
    if (!video || !button) return;

    const setStarted = started => figure.classList.toggle('is-started', started);

    button.hidden = false;
    button.addEventListener('click', () => {
      setStarted(true);
      video.play().catch(() => setStarted(false));
      video.focus({ preventScroll: true });
    });
    video.addEventListener('play', () => setStarted(true));
    video.addEventListener('ended', () => {
      setStarted(false);
      button.focus({ preventScroll: true });
    });
  });
})();
