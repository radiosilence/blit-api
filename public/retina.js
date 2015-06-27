var img = document.getElementById('img');
img.style.opacity = window.requestAnimationFrame ? 0 : 1;
img.width = img.width / window.devicePixelRatio;
img.height = img.height / window.devicePixelRatio;
window.requestAnimationFrame(function() {
  img.style.opacity = 1;
});
