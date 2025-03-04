const fetch = require('node-fetch');  // Import fetch
const FormData = require('form-data');  // Import form-data (CommonJS compatible)

async function uploadImage(buffer) {
  // Dynamically import file-type (since it is an ES module)
  const { fileTypeFromBuffer } = await import('file-type');  

  const { ext, mime } = await fileTypeFromBuffer(buffer);  // Get file extension and mime type
  const form = new FormData();  // Create FormData instance
  form.append('file', buffer, 'tmp.' + ext);  // Append the image buffer to form data

  // Send POST request to telegra.ph to upload image
  let res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form,  // Send form data as the body
  });

  let img = await res.json();  // Parse the JSON response
  if (img.error) throw img.error;  // Throw error if there's any problem with the upload
  
  // Return the URL of the uploaded image
  return 'https://telegra.ph' + img[0].src;
}

module.exports = uploadImage;  // Export for use in other modules
