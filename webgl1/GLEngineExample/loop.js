function loopInterval(callback, interval) {
  let previous = 0;

  function window_onAnimate(timestamp) {
    const elapsed = timestamp - previous;
    if (elapsed >= interval) {
      callback(timestamp);
      previous = timestamp;
    }
    updateHandle();
  }

  function updateHandle() {
    window.requestAnimationFrame(window_onAnimate);
  }

  updateHandle();
}

