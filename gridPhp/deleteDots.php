<?php
$servername = "localhost";
$username = "willeans_dotDisplay";

$dbname = "willeans_dotDisplay";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$code = $_POST['code'];
$dotQuery = "DELETE FROM displays WHERE code = '$code'";
$conn->query($dotQuery);
$conn->close();
?>