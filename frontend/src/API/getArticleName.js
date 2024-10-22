export default function getArticleName(inputString) {
    const minusIndex = inputString.indexOf('-');
    
    if (minusIndex === -1) {
      return '';
    }
  
    return inputString.substring(0, minusIndex);
  }
