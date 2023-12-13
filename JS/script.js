$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
});
document.addEventListener("DOMContentLoaded", function() {
    // Simulate a click on the button that triggers the modal
    document.querySelector('.btn-primary').click();
});
let mediaStream;
let moreThenOnePerson = false;
let stopTracking;

function openCamera() {


    const constraints = {
        video: true,
    };
    stopTracking = false

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.id = 'videoPlayer'
            video.style.position = 'relative'

            document.getElementById("open-camera").style.display = "none";
            document.getElementById("capture-button").style.display = 'block'   
            document.getElementById("ovalOverlay").style.display = 'block'   

            const previewContainer = document.getElementById('cameraPreview');
            // previewContainer.innerHTML = '';




            previewContainer.appendChild(video);

            const cameraPreviewDiv = document.getElementById('cameraPreview').getBoundingClientRect();

            // Wait for the video to be loaded and start playing
            video.onloadedmetadata = function () {
                // Load face-api.js models before using face detection
                Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.ageGenderNet.loadFromUri('/models')
                    // Add more models if needed
                ])
                    .then(function () {
                        // Now that the models are loaded, you can start face tracking
                        trackFace(video);
                    })
                    .catch(function (error) {
                        console.error('Error loading face-api.js models:', error);
                    });
            };
        })
        .catch(function (error) {
            console.error('Error accessing the camera:', error);
        });
}

function trackFace(video) {
    if(stopTracking == false){
        const cameraPreviewDiv = document.getElementById('videoPlayer').getBoundingClientRect();



    
    
        // Append the canvas to the cameraPreview div
        // document.getElementById('cameraPreview').appendChild(canvas);
        var canvas   = document.getElementById('faceTrack')
        var videoPlayer = document.getElementById('videoPlayer')
        console.log("🚀 ~ file: script.js:110 ~ trackFace ~ videoPlayer:", videoPlayer)
    
        canvas.width = cameraPreviewDiv.width;
        canvas.height = cameraPreviewDiv.height;
        // videoPlayer.style.position = 'absolute'
    
        // Style the canvas and position it over the video
        faceTrack.style.position = 'absolute';
    
        // Get the context of the canvas for drawing
        const ctx = canvas.getContext('2d');
        var interval = 100
    
        // Start face detection and tracking
        setInterval(async () => {
            // Detect faces in the current video frame
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender();
    
            const moreThenOnePerson = document.createElement('p');
            moreThenOnePerson.innerHTML = 'More then one person detected';
            moreThenOnePerson.style.color = 'red'
            moreThenOnePerson.style.position = 'relative'
            moreThenOnePerson.id = 'moreThenOnePerson'
    
            if(detections.length > 1){
                const check = document.getElementById('moreThenOnePerson');
                if (check) {
                    check.style.display = 'block';
                }else{
                    document.getElementById('cameraPreview').appendChild(moreThenOnePerson);
                }
    
            }else{
                const check = document.getElementById('moreThenOnePerson');
                if (check) {
                    check.style.display = 'none';
                }
                // captureImage(videoPlayer)
                //TODO stop the execution of this whole function here
            }
    
            // Ensure that video dimensions are available
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                // Size the canvas to the video dimensions
                // canvas.width = '160';
                // canvas.height = '130';
            
    
                // Clear previous drawings
                ctx.clearRect(0, 0, canvas.width, canvas.height);
    
                // Draw face bounding boxes
                faceapi.draw.drawDetections(canvas, faceapi.resizeResults(detections, { width: canvas.width, height: canvas.height }));
    
                // Draw landmarks (optional)
                // faceapi.draw.drawFaceLandmarks(canvas, faceapi.resizeResults(detections, { width: '160', height: '130' }));
    
                // Draw preview at the center of the first detected face (if available)
                if (detections.length > 0) {
                    const face = detections[0].detection.box;
                    const previewSize = 100; // Set the preview size as needed
    
                    const previewX = face.x + face.width / 2 - previewSize / 2;
                    const previewY = face.y + face.height / 2 - previewSize / 2;
    
                    // Draw a preview box centered on the face
                    ctx.strokeStyle = 'red'; // Set the border color
                    ctx.lineWidth = 2; // Set the border width
                    ctx.strokeRect(previewX, previewY, previewSize, previewSize);
                }
            }
        }, interval); // Adjust the interval as needed
    }
}


function captureImage(video) {
    stopTracking = true
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/jpeg');

    const capturedImage = document.getElementById('capturedImage');
    capturedImage.src = imageUrl;
    capturedImage.style.display = 'block';

    document.getElementById("cameraPreview").style.display = "none";
    document.getElementById("capture-button").style.display = "none";
    // Add face detection logic here
    faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .then((faces) => {
            if (faces.length > 0) {
                console.log('Face detected!');
                // Add your logic when a face is detected
                document.getElementById("getQuote").disabled = false;
                document.getElementById("noFaceDetected").style.display = 'none';

            } else {
                console.log('No face detected.');
                // Add your logic when no face is detected
                const noFaceDetected = document.createElement('p');
                noFaceDetected.innerHTML = 'No face detected, tap on the image to open camera again.';
                noFaceDetected.style.color = 'red'
                noFaceDetected.style.position = 'relative'
                noFaceDetected.id = 'noFaceDetected'
                const selfie = document.getElementById('selfie');
                document.getElementById("getQuote").disabled = true;
                selfie.appendChild(noFaceDetected)
            }
        });
}




function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = '300px';
        const preview = document.getElementById('preview');
        preview.innerHTML = '';
        preview.appendChild(img);
    };
    reader.readAsDataURL(file);
};
let isCameraShown = false;

function toggleCamera() {
    if (isCameraShown) {
        document.getElementById("cameraPreview").style.display = "none";
        document.getElementById("capturedImage").style.display = "block";
        
        isCameraShown = false;
    } else {
        document.getElementById("cameraPreview").style.display = "block";
        document.getElementById("capturedImage").style.display = "none";
        document.getElementById("capture-button").style.display = "block";
        document.getElementById("noFaceDetected").style.display = "none";

        isCameraShown = true;


    }
};

function openCameraOdometer() {
    const constraints = {
        video: {
            facingMode: 'environment', // Use 'user' for front camera, 'environment' for back camera
        },
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            mediaStream = stream;
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.id = 'odometerVideoPlayer';

            const previewContainer = document.getElementById('OdometercameraPreview');
            // previewContainer.innerHTML = ''; // Clear any existing content
            previewContainer.appendChild(video);

            document.getElementById("open-odometer-camera").style.display = "none";
            document.getElementById("capture-button-odo-meter").style.display = "block";
        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
        });
}

function captureImageOdometer() {
    const constraints = {
        video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                video.width = this.videoWidth;
                video.height = this.videoHeight;

                var rectangleOverlay = document.getElementById('rectangleOverlay').getBoundingClientRect();
                console.log("🚀 ~ file: script.js:434 ~ .then ~ rectangleOverlay:", rectangleOverlay)

                // Percentage values for overlay position
                const overlayTopPercentage = 30;
                const overlayLeftPercentage = 35;

                // Calculate pixel values based on percentages
                const cropX = (overlayLeftPercentage / 300) * video.videoWidth;
                const cropY = (overlayTopPercentage / 100) * video.videoHeight;

                // Adjust the crop region based on your overlay dimensions
                const cropWidth = 520; // Adjust as needed
                const cropHeight = 220; // Adjust as needed

                const canvas = document.createElement('canvas');
                canvas.width = cropWidth;
                canvas.height = cropHeight;
                const ctx = canvas.getContext('2d');
                
                // Draw the captured region without resizing
                ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

                const imageUrl = canvas.toDataURL('image/jpeg');

                const capturedImage = document.getElementById('capturedImageOdometer');

                // Adjust the displayed image size while preserving aspect ratio
                const aspectRatio = cropWidth / cropHeight;
                const maxWidth = 200; // Set the maximum width as needed
                const maxHeight = maxWidth / aspectRatio;

                capturedImage.style.width = `${maxWidth}px`;
                capturedImage.style.height = `${maxHeight}px`;

                capturedImage.src = imageUrl;
                capturedImage.style.display = 'block';

                document.getElementById("OdometercameraPreview").style.display = "none";
                document.getElementById("capture-button-odo-meter").style.display = "none";

                stream.getTracks().forEach(track => track.stop());

                processOdometerReading()
            };
            video.play();
        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
            // Display an error message or handle the error accordingly
        });
}


function toggleCameraOdometer() {
    if (isCameraShown) {
        document.getElementById("OdometercameraPreview").style.display = "none";
        document.getElementById("capturedImageOdometer").style.display = "block";
        isCameraShown = false;
    } else {
        document.getElementById("OdometercameraPreview").style.display = "block";
        document.getElementById("capturedImageOdometer").style.display = "none";
        // document.getElementById("capture-button-odo-meter").style.display = "block";
        isCameraShown = true;
    }
    var odometerVideoPlayer = document.getElementById('odometerVideoPlayer');
    odometerVideoPlayer.remove();

    openCameraOdometer()

    document.getElementById("errorInOdometer").innerHTML = ''
    document.getElementById("errorInOdometer").classList.remove('error-message');
}


// Function to perform OCR using Tesseract.js
function performOCR(imageData, callback) {
    Tesseract.recognize(
        imageData,
        'eng', // Language code (English in this case)
        { logger: info => console.log(info) } // Logger function to view progress (optional)
    ).then(response => {
    callback(response.text)
    }).catch(error => {
        // Handle OCR error here
        console.error('OCR Error:', error);
        callback('');
    });
}

function processOdometerReading() {
    const capturedImageOdometer = document.getElementById('capturedImageOdometer').src;

    performOCR(capturedImageOdometer, function (odometerText) {
        var textFound = /^\d{6}$/.test(parseInt(odometerText))
        console.log("🚀 ~ file: script.js:530 ~ textFound:", textFound)
        if(textFound == false){
            odometerReadingError = 'No valid scan detected, click on the image to open camera again.'
            document.getElementById("errorInOdometer").innerHTML = odometerReadingError
            document.getElementById("errorInOdometer").classList.add('error-message');
        }
    })

}

// Updated getQuote function
function getQuote() {
    // Gather all the necessary data
    const enteredMiles = document.querySelector('.mile-field').value;
    const capturedImage = document.getElementById('capturedImage').src;
    const capturedImageOdometer = document.getElementById('capturedImageOdometer').src;

    // Perform OCR on the odometer image
    performOCR(capturedImageOdometer, function (odometerText) {

        // Extracted manual reading from user input (replace with your actual logic)
        const manualReading = document.getElementById('manualReadingInput').value;

        const extractedReading = odometerText.match(/\d+/g);

        if(!extractedReading.includes(enteredMiles)){
            showRetryModal();
        }else{
            // Create a FormData object to send data as a multipart/form-data
            const formData = new FormData();
            formData.append('enteredMiles', enteredMiles);
            formData.append('capturedImage', capturedImage);
            formData.append('capturedImageOdometer', capturedImageOdometer);
            formData.append('manualReading', manualReading);
            formData.append('odometerText', odometerText); // Include OCR result in the request

            // Send data to the server using AJAX
            $.ajax({
                type: 'POST',
                url: 'backend.php', // Update with the correct URL
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    // Handle the server response if needed
                    alert('Successfully uploaded the reading!');
                    location.reload(); // Attempt to close the current tab
                },
                error: function (error) {
                    console.error('Error sending data to the server:', error);
                }
            });
        }

    });
}


// Replace the alert with a custom modal
function showRetryModal() {
    // Create the modal HTML
    const modalHTML = `
        <div class="modal fade" id="retryModal" tabindex="-1" role="dialog" aria-labelledby="retryModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="retryModalLabel">Retry</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        The reading from odometer does not match the Enter Miles value.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="retry()">Retry</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append the modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show the modal
    $('#retryModal').modal('show');
}


// Function to retry (reload the current page)
function retry() {
    $('#retryModal').modal('hide'); // Hide the modal
    location.reload(); // Reload the current page
}