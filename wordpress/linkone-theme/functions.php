<?php
/**
 * LinkOne theme functions
 *
 * @package LinkOne
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('linkone_setup')) {
    function linkone_setup() {
        add_theme_support('title-tag');
        add_theme_support('automatic-feed-links');
        add_theme_support('html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ]);
        add_theme_support('post-thumbnails');
        add_theme_support('responsive-embeds');

        register_nav_menus([
            'primary' => __('Primary Menu', 'linkone'),
        ]);
    }
}
add_action('after_setup_theme', 'linkone_setup');

if (!function_exists('linkone_enqueue_assets')) {
    function linkone_enqueue_assets() {
        $theme   = wp_get_theme();
        $version = $theme->get('Version') ?: '1.0.0';

        // Google Fonts (Noto Sans JP + Playfair Display)
        wp_enqueue_style(
            'linkone-fonts',
            'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Playfair+Display:wght@700;900&display=swap',
            [],
            null
        );

        // Required theme stylesheet (metadata + any overrides)
        wp_enqueue_style(
            'linkone-style',
            get_stylesheet_uri(),
            ['linkone-fonts'],
            $version
        );

        // Main LP styles
        wp_enqueue_style(
            'linkone-main',
            get_theme_file_uri('/assets/styles.css'),
            ['linkone-style'],
            $version
        );

        // Sample-request config (window.LINKONE_SAMPLE_CONFIG). Loads BEFORE
        // script.js so the sample-form module can read it on init.
        $config_path = get_theme_file_path('/assets/js/sample-config.js');
        if (file_exists($config_path)) {
            wp_enqueue_script(
                'linkone-sample-config',
                get_theme_file_uri('/assets/js/sample-config.js'),
                [],
                $version,
                [
                    'in_footer' => true,
                    'strategy'  => 'defer',
                ]
            );
        }

        // Main LP script (footer + defer)
        wp_enqueue_script(
            'linkone-main',
            get_theme_file_uri('/assets/script.js'),
            file_exists($config_path) ? ['linkone-sample-config'] : [],
            $version,
            [
                'in_footer' => true,
                'strategy'  => 'defer',
            ]
        );

        // Concept-section origins network graphic (SVG renderer)
        $network_path = get_theme_file_path('/assets/js/origins-network.js');
        if (file_exists($network_path)) {
            wp_enqueue_script(
                'linkone-origins-network',
                get_theme_file_uri('/assets/js/origins-network.js'),
                [],
                $version,
                [
                    'in_footer' => true,
                    'strategy'  => 'defer',
                ]
            );
        }
    }
}
add_action('wp_enqueue_scripts', 'linkone_enqueue_assets');

/**
 * Add a `<link rel="icon">` and theme-color meta to the document head.
 */
if (!function_exists('linkone_head_meta')) {
    function linkone_head_meta() {
        $favicon = esc_url(get_theme_file_uri('/assets/favicon.svg'));
        echo '<link rel="icon" type="image/svg+xml" href="' . $favicon . '" />' . "\n";
        echo '<meta name="theme-color" content="#0e1722" />' . "\n";
    }
}
add_action('wp_head', 'linkone_head_meta', 5);

/**
 * Open Graph / Twitter card tags (only on the front page).
 */
if (!function_exists('linkone_og_tags')) {
    function linkone_og_tags() {
        if (!is_front_page()) {
            return;
        }
        $title = 'LinkOne — Specialty Coffee Importers Alliance';
        $desc  = 'つながりで届ける。特定産地の専門商社が横でつながる、スペシャルティコーヒー インポーターズ アライアンス。';
        $img   = esc_url(get_theme_file_uri('/assets/favicon.svg'));
        $url   = esc_url(home_url('/'));

        echo '<meta property="og:type" content="website" />' . "\n";
        echo '<meta property="og:url" content="' . $url . '" />' . "\n";
        echo '<meta property="og:site_name" content="LinkOne" />' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($desc) . '" />' . "\n";
        echo '<meta property="og:image" content="' . $img . '" />' . "\n";
        echo '<meta name="twitter:card" content="summary" />' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr($desc) . '" />' . "\n";
    }
}
add_action('wp_head', 'linkone_og_tags', 6);

/**
 * REST API: Sample Request - Send sample request emails
 * Endpoint: POST /wp-json/linkone/v1/send-sample-request
 */
if (!function_exists('linkone_register_rest_endpoints')) {
    function linkone_register_rest_endpoints() {
        register_rest_route('linkone/v1', '/send-sample-request', [
            'methods'             => 'POST',
            'callback'            => 'linkone_handle_sample_request',
            'permission_callback' => '__return_true',
            'args'                => [
                'name'    => ['required' => true, 'type' => 'string'],
                'company' => ['required' => true, 'type' => 'string'],
                'phone'   => ['required' => true, 'type' => 'string'],
                'email'   => ['required' => true, 'type' => 'string'],
                'postal'  => ['required' => true, 'type' => 'string'],
                'address' => ['required' => true, 'type' => 'string'],
                'note'    => ['required' => false, 'type' => 'string'],
                'origins' => ['required' => true, 'type' => 'array'],
                'recipients' => ['required' => true, 'type' => 'array'],
            ]
        ]);

        register_rest_route('linkone/v1', '/send-partnership-inquiry', [
            'methods'             => 'POST',
            'callback'            => 'linkone_handle_partnership_inquiry',
            'permission_callback' => '__return_true',
            'args'                => [
                'contact_name'    => ['required' => true, 'type' => 'string'],
                'company_name'    => ['required' => true, 'type' => 'string'],
                'origin_focus'    => ['required' => true, 'type' => 'string'],
                'phone'           => ['required' => true, 'type' => 'string'],
                'email'           => ['required' => true, 'type' => 'string'],
                'website'         => ['required' => false, 'type' => 'string'],
                'background'      => ['required' => true, 'type' => 'string'],
                'inquiry_details' => ['required' => false, 'type' => 'string'],
            ]
        ]);
    }
}
add_action('rest_api_init', 'linkone_register_rest_endpoints');

if (!function_exists('linkone_handle_sample_request')) {
    function linkone_handle_sample_request($request) {
        $params = $request->get_json_params();

        // Validate required fields
        $required = ['name', 'company', 'phone', 'email', 'postal', 'address'];
        foreach ($required as $field) {
            if (empty($params[$field])) {
                return new WP_Error('missing_field', "Missing required field: $field", ['status' => 400]);
            }
        }

        if (empty($params['origins']) || !is_array($params['origins'])) {
            return new WP_Error('missing_origins', 'No origins selected', ['status' => 400]);
        }

        if (empty($params['recipients']) || !is_array($params['recipients'])) {
            return new WP_Error('missing_recipients', 'No recipient emails provided', ['status' => 400]);
        }

        // Sanitize inputs
        $name    = sanitize_text_field($params['name']);
        $company = sanitize_text_field($params['company']);
        $phone   = sanitize_text_field($params['phone']);
        $email   = sanitize_email($params['email']);
        $postal  = sanitize_text_field($params['postal']);
        $address = sanitize_text_field($params['address']);
        $note    = sanitize_textarea_field($params['note'] ?? '');
        $origins = array_map('sanitize_text_field', $params['origins']);
        $recipients = array_filter(
            array_map('sanitize_email', $params['recipients']),
            function($e) { return !empty($e) && is_email($e); }
        );

        if (empty($recipients)) {
            return new WP_Error('invalid_recipients', 'No valid recipient emails', ['status' => 400]);
        }

        // Validate email format
        if (!is_email($email)) {
            return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
        }

        // Build email subject and body
        $subject = sprintf('[LinkOne] サンプル依頼 / %s 様', $company);
        $body_lines = [
            'LinkOne 加盟各社 御中',
            '',
            '下記のとおり、サンプルを依頼させていただきます。',
            '',
            '──────────────────────────',
            sprintf('■ ご依頼先: %s', implode(', ', $origins)),
            '──────────────────────────',
            '',
            '【ご依頼者様情報】',
            sprintf('氏名      : %s', $name),
            sprintf('会社・屋号: %s', $company),
            sprintf('電話番号  : %s', $phone),
            sprintf('メール    : %s', $email),
            sprintf('郵便番号  : %s', $postal),
            sprintf('住所      : %s', $address),
            '',
            '【備考】',
            !empty($note) ? $note : '(なし)',
            '',
            '──────────────────────────',
            '本メールは LinkOne サイトのサンプル依頼フォームから送信されています。',
            'LinkOne 事務局 (contact@miraiseeds.com) は BCC にて受信しています。',
            '',
            'このメールにはご返信いただけません。',
        ];
        $body = implode("\r\n", $body_lines);

        // Set up headers with BCC
        $bcc_email = 'contact@miraiseeds.com';
        $headers = [
            'From: ' . get_option('blogname') . ' <' . get_option('admin_email') . '>',
            'Content-Type: text/plain; charset=UTF-8',
            'BCC: ' . $bcc_email,
        ];

        // Send emails to each recipient
        $sent_to = [];
        $failed = [];
        foreach ($recipients as $recipient) {
            $sent = wp_mail($recipient, $subject, $body, $headers);
            if ($sent) {
                $sent_to[] = $recipient;
            } else {
                $failed[] = $recipient;
            }
        }

        if (empty($sent_to)) {
            return new WP_Error('send_failed', 'Failed to send emails', ['status' => 500]);
        }

        // Log the sample request (optional: store in custom post type or log file)
        do_action('linkone_sample_request_sent', [
            'name' => $name,
            'company' => $company,
            'email' => $email,
            'phone' => $phone,
            'postal' => $postal,
            'address' => $address,
            'origins' => $origins,
            'recipients' => $sent_to,
            'timestamp' => current_time('mysql'),
        ]);

        return [
            'success' => true,
            'message' => sprintf('メール送信完了: %d件', count($sent_to)),
            'sent_to' => $sent_to,
            'failed' => $failed,
        ];
    }
}

if (!function_exists('linkone_handle_partnership_inquiry')) {
    function linkone_handle_partnership_inquiry($request) {
        $params = $request->get_json_params();

        // Validate required fields
        $required = ['contact_name', 'company_name', 'origin_focus', 'phone', 'email', 'background'];
        foreach ($required as $field) {
            if (empty($params[$field])) {
                return new WP_Error('missing_field', "Missing required field: $field", ['status' => 400]);
            }
        }

        // Sanitize inputs
        $contact_name    = sanitize_text_field($params['contact_name']);
        $company_name    = sanitize_text_field($params['company_name']);
        $origin_focus    = sanitize_text_field($params['origin_focus']);
        $phone           = sanitize_text_field($params['phone']);
        $email           = sanitize_email($params['email']);
        $website         = sanitize_url($params['website'] ?? '');
        $background      = sanitize_textarea_field($params['background']);
        $inquiry_details = sanitize_textarea_field($params['inquiry_details'] ?? '');

        // Validate email format
        if (!is_email($email)) {
            return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
        }

        // Build email
        $subject = sprintf('[LinkOne] パートナーシップ問い合わせ / %s 様', $company_name);
        $body_lines = [
            'LinkOne 事務局 御中',
            '',
            '下記の企業よりパートナーシップ（LinkOne への参加）についての問い合わせがございました。',
            '',
            '──────────────────────────',
            '',
            '【問い合わせ企業情報】',
            sprintf('ご担当者名: %s', $contact_name),
            sprintf('会社名    : %s', $company_name),
            sprintf('産地・地域: %s', $origin_focus),
            sprintf('電話番号  : %s', $phone),
            sprintf('メール    : %s', $email),
            $website ? sprintf('ウェブサイト: %s', $website) : '',
            '',
            '【直接取引のルート・実績】',
            $background,
            '',
            '【ご質問・ご要望】',
            !empty($inquiry_details) ? $inquiry_details : '(なし)',
            '',
            '──────────────────────────',
            '本メールは LinkOne サイトのパートナーシップ問い合わせフォームから送信されています。',
            sprintf('送信日時: %s', current_time('Y-m-d H:i:s')),
        ];
        $body = implode("\r\n", array_filter($body_lines));

        $headers = [
            'From: ' . get_option('blogname') . ' <' . get_option('admin_email') . '>',
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $email,
        ];

        // Send to LinkOne office
        $admin_email = 'contact@miraiseeds.com';
        $sent = wp_mail($admin_email, $subject, $body, $headers);

        if (!$sent) {
            return new WP_Error('send_failed', 'Failed to send inquiry', ['status' => 500]);
        }

        // Log the partnership inquiry
        do_action('linkone_partnership_inquiry_received', [
            'contact_name' => $contact_name,
            'company_name' => $company_name,
            'origin_focus' => $origin_focus,
            'phone' => $phone,
            'email' => $email,
            'website' => $website,
            'background' => $background,
            'timestamp' => current_time('mysql'),
        ]);

        return [
            'success' => true,
            'message' => 'Partnership inquiry sent successfully.',
        ];
    }
}
