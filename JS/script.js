$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
});
document.addEventListener("DOMContentLoaded", function() {
    // Simulate a click on the button that triggers the modal
    document.querySelector('.btn-primary').click();
});
let mediaStream;

function openCamera() {

    const constraints = {
        video: true,


    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {

            mediaStream = stream;
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;

            document.getElementById("open-camera").style.display = "none";
            document.getElementById("capture-button").style.display = "block";
            // document.getElementById("cameraPreview").style.display = "block";
            const previewContainer = document.getElementById('cameraPreview');
            previewContainer.innerHTML = ''; // Clear any existing content
            previewContainer.appendChild(video); // Add the video stream to the preview container

        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
        });
};

function captureImage() {
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

                stream.getTracks().forEach(track => track.stop());
            };
            video.play();
        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
            // Display an error message or handle the error accordingly
        });
};



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
        isCameraShown = true;
    }
};
// Odometercamera

// function openCameraOdometer() {
//     const constraints = {
//         video: true,
//     };

//     navigator.mediaDevices.getUserMedia(constraints)
//         .then(function(stream) {
//             mediaStream = stream;
//             const video = document.createElement('video');
//             video.srcObject = stream;
//             video.autoplay = true;

//             // Create a div for the overlay
//             const overlay = document.createElement('div');
//             overlay.style.position = 'absolute';
//             overlay.style.width = '135px'; // Adjust the width as needed
//             overlay.style.height = '60px'; // Adjust the height as needed
//             overlay.style.border = '2px dashed white'; // Border for visualization
//             overlay.style.top = '55%';
//             overlay.style.left = '9.5%';
          
//             overlay.style.pointerEvents = 'none'; // Allow clicks to go through the overlay

//             // Append the video and overlay to the preview container
//             const previewContainer = document.getElementById('OdometercameraPreview');
//             previewContainer.innerHTML = ''; // Clear any existing content
//             previewContainer.appendChild(video);
//             previewContainer.appendChild(overlay);

//             document.getElementById("open-odometer-camera").style.display = "none";
//             document.getElementById("capture-button-odo-meter").style.display = "block";

//         })
//         .catch(function(error) {
//             console.error('Error accessing the camera:', error);
//         });
// }


// function captureImageOdometer() {
//     const constraints = {
//         video: true,
//     };

//     navigator.mediaDevices.getUserMedia(constraints)
//         .then(function(stream) {
//             const video = document.createElement('video');
//             video.srcObject = stream;
//             video.onloadedmetadata = function(e) {
//                 video.width = this.videoWidth;
//                 video.height = this.videoHeight;

//                 const canvas = document.createElement('canvas');
//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//                 const imageUrl = canvas.toDataURL('image/jpeg');

//                 const capturedImage = document.getElementById('capturedImageOdometer');
//                 capturedImage.src = imageUrl;
//                 capturedImage.style.display = 'block';

//                 document.getElementById("OdometercameraPreview").style.display = "none";
//                 document.getElementById("capture-button-odo-meter").style.display = "none";

//                 stream.getTracks().forEach(track => track.stop());
//             };
//             video.play();
//         })
//         .catch(function(error) {
//             console.error('Error accessing the camera:', error);
//             // Display an error message or handle the error accordingly
//         });
// };


// function toggleCameraOdometer() {
//     if (isCameraShown) {
//         document.getElementById("OdometercameraPreview").style.display = "none";
//         document.getElementById("capturedImageOdometer").style.display = "block";
//         isCameraShown = false;
//     } else {
//         document.getElementById("OdometercameraPreview").style.display = "block";
//         document.getElementById("capturedImageOdometer").style.display = "none";
//         document.getElementById("capture-button-odo-meter").style.display = "block";
//         isCameraShown = true;
//     }
// };


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

            // Create a div for the overlay
            const overlay = document.createElement('div');
            overlay.id = 'rectangleOverlay';
            overlay.style.position = 'absolute';
            overlay.style.width = '135px'; // Adjust the width as needed
            overlay.style.height = '50px'; // Adjust the height as needed
            overlay.style.border = '2px dashed white'; // Border for visualization
            overlay.style.top = '55%';
            overlay.style.left = '10%';
            overlay.style.pointerEvents = 'none'; // Allow clicks to go through the overlay

            // Append the video and overlay to the preview container
            const previewContainer = document.getElementById('OdometercameraPreview');
            previewContainer.innerHTML = ''; // Clear any existing content
            previewContainer.appendChild(video);
            previewContainer.appendChild(overlay);


            const applyResponsiveStyles = function() {
                const rectangleOverlay = document.getElementById('rectangleOverlay');
                
                const windowWidth = window.innerWidth;
                
                if (windowWidth <= 991  && windowWidth >= 983) {
                    // Adjust styles for smaller screens (tablets and below)
                    rectangleOverlay.style.width = '95px';
                    rectangleOverlay.style.height = '30px';
                    rectangleOverlay.style.top = '57%';
                    rectangleOverlay.style.left = '15.5%';
                }
                else if (windowWidth < 983 && windowWidth > 500) {
                    // Adjust styles for smaller screens (tablets and below)
                    rectangleOverlay.style.width = '95px';
                    rectangleOverlay.style.height = '30px';
                    rectangleOverlay.style.top = '57%';
                    rectangleOverlay.style.left = '12.5%';
                }
                else if (windowWidth < 768 && windowWidth > 500) {
                    // Adjust styles for smaller screens (tablets and below)
                    rectangleOverlay.style.width = '95px';
                    rectangleOverlay.style.height = '30px';
                    rectangleOverlay.style.top = '32.5%';
                    rectangleOverlay.style.left = '40.5%';
                } else if (windowWidth <= 500 && windowWidth > 400) {
                    // Adjust styles for smaller screens (tablets and below)
                    rectangleOverlay.style.width = '95px';
                    rectangleOverlay.style.height = '30px';
                    rectangleOverlay.style.top = '30.5%';
                    rectangleOverlay.style.left = '39%';
                } 
                
                else if (windowWidth <= 400 && windowWidth >= 346) {
                    // Adjust styles for smaller screens (tablets and below)
                    rectangleOverlay.style.width = '95px';
                    rectangleOverlay.style.height = '30px';
                    rectangleOverlay.style.top = '30.5%';
                    rectangleOverlay.style.left = '37%';
                }
                else if (windowWidth <= 346) {
                    // Adjust styles for smaller screens (tablets and below)
                    rectangleOverlay.style.width = '95px';
                    rectangleOverlay.style.height = '30px';
                    rectangleOverlay.style.top = '39.5%';
                    rectangleOverlay.style.left = '37%';
                }else {
                    // Default styles for larger screens
                    rectangleOverlay.style.width = '135px';
                    rectangleOverlay.style.height = '50px';
                    rectangleOverlay.style.top = '55%';
                    rectangleOverlay.style.left = '10%';
                }
            };

            // Initial application of styles
            applyResponsiveStyles();
            window.addEventListener('resize', applyResponsiveStyles);

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

                // Percentage values for overlay position
                const overlayTopPercentage = 30;
                const overlayLeftPercentage = 23;

                // Calculate pixel values based on percentages
                const cropX = (overlayLeftPercentage / 100) * video.videoWidth;
                const cropY = (overlayTopPercentage / 100) * video.videoHeight;

                // Adjust the crop region based on your overlay dimensions
                const cropWidth = 335; // Adjust as needed
                const cropHeight = 90; // Adjust as needed

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
        document.getElementById("capture-button-odo-meter").style.display = "block";
        isCameraShown = true;
    }
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