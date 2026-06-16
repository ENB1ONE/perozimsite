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
    echo json_encode(['error' => 'Você deve alterar sua senha inicial antes de realizar alterações no conteúdo.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['articles']) || !isset($data['featured'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos ou incompletos.']);
    exit;
}

if (!is_array($data['featured']) || count($data['featured']) !== 2) {
    http_response_code(400);
    echo json_encode(['error' => 'A lista de destaques deve conter exatamente 2 artigos selecionados.']);
    exit;
}

$json_content = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if (file_put_contents('data.json', $json_content) !== false) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar os artigos em data.json no servidor. Verifique as permissões de gravação.']);
}
exit;
?>