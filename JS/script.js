$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
});

function uploadFromSystem() {
    const input = document.getElementById('imageInput');
    input.click();

    input.addEventListener('change', function() {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '160px';
            img.style.maxheight = '130px';
            img.style.overflow = 'hidden';
            document.getElementById("system-upload").style.display = "none";
            document.getElementById("preview").style.display = "block";
            img.style.systemupload = ''; // Set max width for preview
            const previewContainer = document.getElementById('preview');

            previewContainer.innerHTML = ''; // Clear any existing preview
            previewContainer.appendChild(img); // Add the image to the preview container
        };

        reader.readAsDataURL(file);
    });
};

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