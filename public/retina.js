var img = document.getElementById('img');
img.style.opacity = 0;
img.addEventListener('load', function() {
  window.requestAnimationFrame(function() {
    img.width = img.width / window.devicePixelRatio;
    img.style.opacity = 1;
  });
});