<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from the POST request
    $enteredMiles = $_POST['enteredMiles'];
    $capturedImage = $_POST['capturedImage'];
    $capturedImageOdometer = $_POST['capturedImageOdometer'];

    // Connect to your local MySQL database
    $mysqli = new mysqli("localhost", "root", "", "america_mile_odometer");

    // Check connection
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    // Prepare and execute the SQL query to insert data into the database
    $stmt = $mysqli->prepare("INSERT INTO odometer_reading (customer_id, selfie_image, odometer_image, manual_reading) VALUES (?, ?, ?, ?)");

    // Check if the prepare was successful
    if ($stmt === false) {
        die("Error in prepare: " . $mysqli->error);
    }

    // Generate a random customer_id
    $customer_id = rand();

    // Define the directory to store images
    $imageDirectory = "readings/";

    // Generate unique filenames for the images
    $selfieImageName = $customer_id . "_selfie.jpg";
    $odometerImageName = $customer_id . "_odometer.jpg";

    // Decode Base64-encoded images
    $decodedSelfieImage = base64_decode(str_replace('data:image/jpeg;base64,', '', $capturedImage));
    $decodedOdometerImage = base64_decode(str_replace('data:image/jpeg;base64,', '', $capturedImageOdometer));

    // Save images to the directory
    file_put_contents($imageDirectory . $selfieImageName, $decodedSelfieImage);
    file_put_contents($imageDirectory . $odometerImageName, $decodedOdometerImage);

    // Build image paths to store in the database
    $selfieImagePath = $imageDirectory . $selfieImageName;
    $odometerImagePath = $imageDirectory . $odometerImageName;

    // Bind parameters
    $stmt->bind_param("ssss", $customer_id, $selfieImagePath, $odometerImagePath, $enteredMiles);

    // Execute the query
    $result = $stmt->execute();

    // Check if the query execution was successful
    if ($result === false) {
        die("Error in execute: " . $stmt->error);
    }

    // Close the statement and database connection
    $stmt->close();
    $mysqli->close();

    // Dummy response for demonstration purposes
    $response = array(
        'status' => 'success',
        'message' => 'Data received and stored in the database successfully',
        'enteredMiles' => $enteredMiles,
        'selfieImagePath' => $selfieImagePath,
        'odometerImagePath' => $odometerImagePath
    );

    // Send the response back to the frontend
    echo json_encode($response);
} else {
    // Handle other types of requests if needed
    http_response_code(405); // Method Not Allowed
    echo 'Invalid request method';
}
?>
