var img = document.getElementById('img');
img.style.opacity = 0;
img.width = img.width / window.devicePixelRatio;
img.height = img.height / window.devicePixelRatio;
window.requestAnimationFrame(function() {
  img.style.opacity = 1;
});
