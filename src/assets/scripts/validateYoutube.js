const validateYoutube = (url) => {
  if (url != undefined || url != '') {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    } else {
      alert('Not a valid Youtube link!');
      return '';
    }
  }
};

export default validateYoutube;
