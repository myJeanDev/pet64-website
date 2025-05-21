<?php session_start() ?>
<?php
$servername = "localhost";
$username = "willeans_dotDisplay";

$dbname = "willeans_dotDisplay";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$userId = $_SESSION['id'];
$displayId = $_POST['code'];

$dotQuery = "INSERT INTO likes (userId, displayId) VALUES ('$userId', '$displayId')";
$conn->query($dotQuery);
$conn->close();
?>