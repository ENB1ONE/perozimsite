<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado.']);
    exit;
}

if ($_SESSION['admin_must_change_password'] === true) {
    http_response_code(403);
    echo json_encode(['error' => 'Você deve alterar sua senha inicial antes de criar outros usuários.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$new_username = isset($data['username']) ? trim($data['username']) : '';
$new_password = isset($data['password']) ? $data['password'] : '';

if (empty($new_username) || strlen($new_username) < 3 || !ctype_alnum($new_username)) {
    http_response_code(400);
    echo json_encode(['error' => 'O nome de usuário deve ter pelo menos 3 caracteres e conter apenas letras e números.']);
    exit;
}

if (strlen($new_password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'A senha deve ter pelo menos 6 caracteres.']);
    exit;
}

if (!file_exists('config_users.php')) {
    http_response_code(500);
    echo json_encode(['error' => 'Arquivo de configuração não encontrado.']);
    exit;
}

require 'config_users.php';

if (isset($admin_users[$new_username])) {
    http_response_code(409);
    echo json_encode(['error' => 'Este nome de usuário já está sendo utilizado.']);
    exit;
}

$admin_users[$new_username] = [
    'username' => $new_username,
    'password_hash' => password_hash($new_password, PASSWORD_DEFAULT),
    'must_change_password' => true
];

$content = "<?php\n"
         . "// Secure configuration file for administrative users.\n"
         . "// This file is managed automatically by the administration panel.\n"
         . "// DO NOT edit manually unless you know what you are doing.\n\n"
         . "\$admin_users = " . var_export($admin_users, true) . ";\n";

if (file_put_contents('config_users.php', $content) !== false) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao salvar o novo usuário no servidor.']);
}
exit;
?>