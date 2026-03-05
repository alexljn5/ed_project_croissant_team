<?php
require __DIR__ . '/bootstrap/app.php';
$app = app();

$content = \App\Models\PageContent::where('key', 'poi-markers')->first();
echo "VALUE TYPE: " . gettype($content->value) . "\n";
echo "IS ARRAY: " . (is_array($content->value) ? "YES" : "NO") . "\n";
echo "VALUE:\n";
var_dump($content->value);
