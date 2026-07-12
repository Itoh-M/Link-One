# LinkOne WordPress Theme Deployment Guide

## Theme Version: 1.1.0

### ✨ What's Included

- **Email-based Sample Request Form** — REST API endpoint with email validation and sanitization
- **Partnership Inquiry Form** — For importer sign-ups with full validation
- **WordPress REST API Endpoints**:
  - `POST /wp-json/linkone/v1/send-sample-request`
  - `POST /wp-json/linkone/v1/send-partnership-inquiry`
- **Enhanced Visual Design** — Modern buttons, improved form styling, section backgrounds
- **Responsive Layout** — Optimized for all devices (6 breakpoints)
- **PWA Support** — `manifest.json` included
- **OGP Tags** — SEO optimization for social media sharing

---

## Deployment Methods

### Method 1: WordPress Admin Panel (Recommended for Shared Hosting)

1. **Log in to WordPress** → Navigate to `Appearance` → `Themes`

2. **Upload Theme ZIP**:
   - Click `Add New` (top left)
   - Click `Upload Theme`
   - Select `/wordpress/linkone-theme.zip`
   - Click `Install Now`

3. **Activate Theme**:
   - After upload completes, click `Activate`
   - Theme will load from `/wp-content/themes/linkone-theme/`

4. **Verify Deployment**:
   - Frontend should show new design
   - Email forms should work (check browser console for errors)
   - Test by submitting a form and verifying email delivery

---

### Method 2: Direct File Upload (Via FTP/SFTP)

1. **Locate WordPress themes directory**: `/wp-content/themes/`

2. **Extract and upload**:
   ```bash
   unzip linkone-theme.zip
   # Upload contents of linkone-theme/ folder to: /wp-content/themes/linkone-theme/
   ```

3. **Set correct permissions**:
   ```bash
   chmod -R 755 /wp-content/themes/linkone-theme/
   chmod 644 /wp-content/themes/linkone-theme/*.php
   chmod 644 /wp-content/themes/linkone-theme/*.css
   ```

4. **Activate in WordPress**:
   - Admin → `Appearance` → `Themes`
   - Click `Activate` next to "LinkOne"

---

### Method 3: WP-CLI (Via SSH/Terminal)

```bash
# Navigate to WordPress root
cd /path/to/wordpress

# Install and activate theme
wp theme install /path/to/linkone-theme.zip --activate

# Verify installation
wp theme list --status=active
```

---

## Post-Deployment Configuration

### 1. Configure Company Email Addresses

Edit `company-config.json` or use admin panel (`?admin=1`):

**File location**: `/wp-content/themes/linkone-theme/assets/js/sample-config.js`

Example configuration:
```javascript
window.LINKONE_SAMPLE_CONFIG = {
  companies: {
    'colombiaOrigins': { label: 'Colombia', emails: ['colombia@example.com'] },
    'peruOrigins': { label: 'Peru', emails: ['peru@example.com'], },
    'ethiopiaOrigins': { label: 'Ethiopia', emails: ['ethiopia@example.com'] },
    'kenyaOrigins': { label: 'Kenya', emails: ['kenya@example.com'] },
    'summitOrigins': { label: 'Summit', emails: ['summit@example.com'] },
  }
};
```

**Or use admin panel**:
- Add `?admin=1` to your home URL
- Edit company emails directly in browser
- Emails are stored in browser localStorage

### 2. Verify Email Sending

**Test REST API endpoints**:

```bash
# Test sample request
curl -X POST https://link-one.co.jp/wp-json/linkone/v1/send-sample-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Company",
    "phone": "090-1234-5678",
    "email": "test@example.com",
    "postal": "100-0001",
    "address": "Tokyo",
    "origins": ["peru"],
    "recipients": ["test@example.com"],
    "note": "Test request"
  }'

# Test partnership inquiry
curl -X POST https://link-one.co.jp/wp-json/linkone/v1/send-partnership-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "contact_name": "John Doe",
    "company_name": "Coffee Company",
    "origin_focus": "Brazil",
    "phone": "090-1234-5678",
    "email": "john@example.com",
    "background": "5 years experience",
    "inquiry_details": "Interested in partnership"
  }'
```

### 3. Check Error Logs

If email sending fails:

```bash
# Check WordPress error log
tail -f /path/to/wordpress/wp-content/debug.log

# Enable debug mode (wp-config.php)
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### 4. Verify Static Assets Load

Check browser DevTools (F12):
- `Console` tab for JavaScript errors
- `Network` tab for CSS/JS loading
- `Elements` tab for HTML structure

---

## Key Files

| File | Purpose |
|------|---------|
| `functions.php` | REST API endpoints, email handling, asset enqueuing |
| `index.php` | WordPress template (575 lines, responsive layout) |
| `assets/styles.css` | Main stylesheet (1161 lines, 6 breakpoints) |
| `assets/script.js` | Form handling, async email submission (563 lines) |
| `assets/js/origins-network.js` | SVG network graphic for origins section |
| `assets/js/sample-config.js` | Company email configuration |
| `style.css` | Theme metadata (WordPress header) |
| `manifest.json` | PWA manifest for browser installation |
| `assets/favicon.svg` | Site favicon |

---

## Security Features

✅ Input validation on all form fields
✅ Email validation with `is_email()` check
✅ Sanitization: `sanitize_text_field()`, `sanitize_email()`, `sanitize_textarea_field()`
✅ BCC to LinkOne office for audit trail
✅ CSRF protection via WordPress REST API
✅ No direct database writes (safe email handling)
✅ WP_Error handling for all error cases

---

## Troubleshooting

### Issue: "Theme directory is empty or doesn't exist"

**Solution**: Ensure ZIP was extracted properly:
```bash
unzip -l /path/to/linkone-theme.zip
# Should list linkone-theme/ directory and all files
```

### Issue: Forms don't submit / 404 on REST API

**Check**:
1. REST API is enabled: `Permalink settings` → Choose a permalink structure (not "Plain")
2. Plugin conflicts: Disable plugins temporarily
3. Error logs: Check `/wp-content/debug.log`

### Issue: Emails not sending

**Check**:
1. WordPress mail function configured: Check `wp-config.php`
2. SMTP settings (if using SMTP plugin)
3. `contact@miraiseeds.com` is valid BCC recipient
4. Check server logs: `/var/log/mail.log` or similar

### Issue: CSS/JS files not loading

**Check**:
1. File permissions: `chmod 644 /wp-content/themes/linkone-theme/assets/*`
2. Theme URL correct in browser (check `get_theme_file_uri()` output)
3. No 404 errors in browser console
4. Clear browser cache: Ctrl+Shift+R / Cmd+Shift+R

---

## Testing Checklist

- [ ] Theme activates without errors
- [ ] Homepage displays new design
- [ ] Sample request form submits and sends email
- [ ] Partnership inquiry form works
- [ ] Emails have correct BCC and From headers
- [ ] Form validation shows error messages
- [ ] Admin panel (`?admin=1`) loads and edits emails
- [ ] Responsive layout on mobile (< 640px)
- [ ] Tablet layout (640px - 860px)
- [ ] Desktop layout (> 860px)
- [ ] All images/SVG load correctly
- [ ] No console errors in DevTools

---

## Rollback Instructions

If issues occur, restore previous theme:

```bash
# Option 1: Via WordPress Admin
Appearance → Themes → Activate previous theme

# Option 2: Via WP-CLI
wp theme activate [previous-theme-slug]

# Option 3: Via FTP
Delete /wp-content/themes/linkone-theme/
Restore backup of previous theme
```

---

## Support

For issues or questions:
1. Check error logs: `/wp-content/debug.log`
2. Review this guide's troubleshooting section
3. Verify all files are present: `unzip -l linkone-theme.zip`
4. Ensure WordPress version 6.0+ (recommended 6.4+)
5. Ensure PHP 7.4+ (recommended 8.0+)

---

**Theme Version**: 1.1.0
**Last Updated**: 2026-05-09
**WordPress Minimum**: 6.0
**PHP Minimum**: 7.4
