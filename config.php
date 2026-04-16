<?php
/**
 * Configuration for the Operational Archetype Quiz
 * For autoworkflows.ai
 */

// Claude API Configuration
define('CLAUDE_API_KEY', getenv('CLAUDE_API_KEY') ?: 'YOUR_CLAUDE_API_KEY_HERE');
define('CLAUDE_MODEL', 'claude-sonnet-4-20250514');
define('CLAUDE_API_URL', 'https://api.anthropic.com/v1/messages');

// Site Configuration
define('SITE_NAME', 'AutoWorkflows.ai');
define('SITE_TAGLINE', 'Operational Archetype Quiz');
define('SITE_URL', 'https://autoworkflows.ai');

// Session configuration
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
