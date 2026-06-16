<?php
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$action = isset($data['action']) ? $data['action'] : '';

if ($action === 'status') {
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        echo json_encode([
            'logged' => true,
            'username' => $_SESSION['admin_username'],
            'must_change_password' => $_SESSION['admin_must_change_password']
        ]);
    } else {
        echo json_encode(['logged' => false]);
    }
    exit;
}

if ($action === 'login') {
    $username = isset($data['username']) ? trim($data['username']) : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Usuário e senha são obrigatórios.']);
        exit;
    }

    if (!file_exists('config_users.php')) {
        http_response_code(500);
        echo json_encode(['error' => 'Arquivo de configuração de usuários não encontrado no servidor.']);
        exit;
    }

    require 'config_users.php';

    if (isset($admin_users[$username])) {
        $user = $admin_users[$username];
        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username'] = $username;
            $_SESSION['admin_must_change_password'] = $user['must_change_password'];

            echo json_encode([
                'success' => true,
                'username' => $username,
                'must_change_password' => $user['must_change_password']
            ]);
            exit;
        }
    }

    http_response_code(401);
    echo json_encode(['error' => 'Usuário ou senha incorretos.']);
    exit;
}

if ($action === 'logout') {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Ação inválida.']);
exit;
?>