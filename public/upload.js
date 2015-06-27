document.addEventListener('DOMContentLoaded', function() {
  var uploadImage = document.getElementById('uploadImage');
  var uploadForm = document.getElementById('uploadForm');
  var uploadSubmit = document.getElementById('uploadSubmit');
  uploadImage.style.display = 'none';
  uploadSubmit
    .addEventListener('click', function(event) {
      console.log('us click');
      event.preventDefault();
      uploadImage.click();
    });
  uploadImage
    .addEventListener('change', function(event) {
      event.preventDefault();
      console.log('ui cha');
      uploadForm.submit();
    });
});

