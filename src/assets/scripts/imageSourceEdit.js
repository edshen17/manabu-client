function imageSourceEdit(imgSrc) {
   if (imgSrc == '') {
    return require('../images/no-profile.webp');
   } else {
    return imgSrc;
   }
  }
  
export default imageSourceEdit;