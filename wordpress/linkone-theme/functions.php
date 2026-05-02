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

        // Main LP script (footer + defer)
        wp_enqueue_script(
            'linkone-main',
            get_theme_file_uri('/assets/script.js'),
            [],
            $version,
            [
                'in_footer' => true,
                'strategy'  => 'defer',
            ]
        );
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
