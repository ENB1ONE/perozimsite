<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$new_password = isset($data['new_password']) ? $data['new_password'] : '';

if (strlen($new_password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'A nova senha deve ter pelo menos 6 caracteres.']);
    exit;
}

if (!file_exists('config_users.php')) {
    http_response_code(500);
    echo json_encode(['error' => 'Arquivo de configuração não encontrado.']);
    exit;
}

require 'config_users.php';
$username = $_SESSION['admin_username'];

if (isset($admin_users[$username])) {
    $admin_users[$username]['password_hash'] = password_hash($new_password, PASSWORD_DEFAULT);
    $admin_users[$username]['must_change_password'] = false;

    $_SESSION['admin_must_change_password'] = false;

    $content = "<?php\n"
             . "// Secure configuration file for administrative users.\n"
             . "// This file is managed automatically by the administration panel.\n"
             . "// DO NOT edit manually unless you know what you are doing.\n\n"
             . "\$admin_users = " . var_export($admin_users, true) . ";\n";

    if (file_put_contents('config_users.php', $content) !== false) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao gravar as alterações no servidor.']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Usuário não encontrado.']);
}
exit;
?>