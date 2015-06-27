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
      uploadSubmit.disabled = true;
      uploadSubmit.value = '...';
    });

  var deleteButtons = document.getElementsByClassName('deleteButton');
  document.addEventListener('click', function(event) {
    var del = findInPath(deleteButtons, event.path);
    if (!del) return;
    event.preventDefault();
    if (confirm('Do you wish to delete ' + del.dataset.name + '?'))
      window.location = '/image/' + del.dataset.id + '/delete?confirm=true';
  });
});

function findInPath(arr, path) {
  for (var i = 0; i < path.length; i++) {
    if (contains(arr, path[i])) return path[i];
  }
}

function contains(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) return true;
  }
}