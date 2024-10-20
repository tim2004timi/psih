export default function getImgName(inputString) {
    const underscoreIndex = inputString.indexOf('_');
    
    if (underscoreIndex === -1) {
      return '';
    }
  
    const dotIndex = inputString.indexOf('.', underscoreIndex);
  
    if (dotIndex === -1) {
      return '';
    }
  
    return inputString.substring(underscoreIndex + 1, dotIndex);
  }
