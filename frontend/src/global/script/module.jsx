export const csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

export function getDominantColor(imgSrc, callback) {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    img.crossOrigin = 'Anonymous'; // To handle CORS
    img.src = imgSrc;
  
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
  
      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      let r = 0, g = 0, b = 0;
  
      // Sum all values of r, g and b
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }
  
      // Get the average values for r, g and b
      r = Math.floor(r / (img.width * img.height));
      g = Math.floor(g / (img.width * img.height));
      b = Math.floor(b / (img.width * img.height));
  
      // Call the callback with the dominant color
      callback(`rgba(${r}, ${g}, ${b}, 0.78)`);
    };
  }
  
export function hasScrollbar(identifier) {
  var element;
  if(identifier.startsWith('.')) {
      // If identifier is a class
      element = document.querySelector(identifier);
  } else if(identifier.startsWith('#')) {
      // If identifier is an id
      element = document.getElementById(identifier.substring(1));
  }

  if(element) {
      // Check if the element has a scrollbar
      
      return element.scrollHeight - element.scrollTop > element.clientHeight
  } else {
      // Element not found
      return null;
  }
}

export function formatNumber(num, lang) {
  const numeralMaps = {
    'km': ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"],
  };

  if (!numeralMaps[lang]) return "Unsupported language";

  return [...num.toString()].map(char => 
      isNaN(parseInt(char)) ? char : numeralMaps[lang][parseInt(char)]
  ).join('');
}

export function socketScope(){
  if (process.env.NODE_ENV == 'development') return "ws"
  else return "wss"
}
