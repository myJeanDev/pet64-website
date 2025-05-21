<?php session_start() ?>
<?php
$servername = "db";
$username = "willeans_dotDisplay";

$dbname = "willeans_dotDisplay";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$userId = $_SESSION['id'];
$code = $_POST['code'];
$dotQuery = "DELETE FROM likes WHERE displayId = '$code' AND userId = '$userId'";
$conn->query($dotQuery);
$conn->close();
?>