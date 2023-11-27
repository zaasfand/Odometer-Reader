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

function openCameraOdometer() {

    const constraints = {
        video: true,


    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {

            mediaStream = stream;
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;

            document.getElementById("open-odometer-camera").style.display = "none";
            document.getElementById("capture-button-odo-meter").style.display = "block";
            // document.getElementById("cameraPreview").style.display = "block";
            const previewContainer = document.getElementById('OdometercameraPreview');
            previewContainer.innerHTML = ''; // Clear any existing content
            previewContainer.appendChild(video); // Add the video stream to the preview container

        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
        });
};

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

                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageUrl = canvas.toDataURL('image/jpeg');

                const capturedImage = document.getElementById('capturedImageOdometer');
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
};


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
};