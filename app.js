document.addEventListener('DOMContentLoaded', async (event) => {
    const video = document.getElementById('camera');
    const captureButton = document.getElementById('captureButton');
    const capturedImage = document.getElementById('capturedImage');
    const croppedImage = document.getElementById('croppedImage');
    const odometerReading = document.getElementById('odometerReading');
    const readingValue = document.getElementById('readingValue');

    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Assign the video stream to the video element
            video.srcObject = stream;

            // Capture image when the button is clicked
            captureButton.addEventListener('click', async function () {
                const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
                const blob = await imageCapture.takePhoto();

                // Display the captured image
                capturedImage.src = URL.createObjectURL(blob);
                capturedImage.style.display = 'block';

                console.log('Captured image:', capturedImage.src);

                // Wait for the image to load its metadata (dimensions)
                await new Promise((resolve) => {
                    capturedImage.onload = resolve;
                });

                try {
                    // Use Tesseract OCR for OCR on the captured image
                    const data = await Tesseract.recognize(capturedImage, 'eng', {
                        logger: (info) => console.log(info),
                    });

                    // Check if 'data' is defined and has the 'text' property
                    if (data && data.text) {
                        // Display the recognized text
                        console.log('Recognized text:', data.text);

                        // Extract the odometer reading
                        const odometerValue = extractOdometerValue(data.text);

                        // Display the odometer reading
                        console.log('Odometer value:', odometerValue);
                        readingValue.textContent = odometerValue || 'Not Found';
                        odometerReading.style.display = 'block';

                        // Crop the image based on the bounding box from Tesseract OCR
                        const { left, top, width, height } = data.blocks[0].bbox;
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = width;
                        canvas.height = height;
                        context.drawImage(capturedImage, left, top, width, height, 0, 0, width, height);
                        croppedImage.src = canvas.toDataURL();
                        croppedImage.style.display = 'block';
                    } else {
                        console.error('Error during recognition. Data structure:', data);
                    }
                } catch (error) {
                    console.error('Error during recognition:', error);
                }
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    } else {
        console.error('getUserMedia not supported in this browser.');
    }

    // Function to extract a 6-digit value from recognized text
    function extractOdometerValue(text) {
        // Find the first occurrence of a 6-digit value in the text
        const sixDigitValue = text.match(/\b\d{6}\b/);

        // Return the 6-digit value or null if not found
        return sixDigitValue ? sixDigitValue[0] : null;
    }
});
