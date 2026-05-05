/* ===== LinkOne — Sample Request Config =====
 *
 * Edit this file to update the sample-request settings:
 *
 *   - bcc:        always BCC'd on every sample request (LinkOne office)
 *   - companies:  one entry per importer. Each `email` is the destination
 *                 the request goes to when that company is checked.
 *
 * Tip: admins can also edit emails live at runtime by visiting the page
 * with `?admin=1`. In-browser edits are stored in localStorage and override
 * the values below until reset. To make the change permanent for everyone,
 * update the file (not localStorage).
 */
window.LINKONE_SAMPLE_CONFIG = {
  bcc: 'contact@miraiseeds.com',
  companies: [
    {
      id: 'brazil',
      country_jp: 'ブラジル',
      country_en: 'Brazil',
      flagEmoji: '🇧🇷',
      company: 'Mirai Seeds',
      email: ''  // ← TODO: 各社のメールアドレスを入力してください
    },
    {
      id: 'panama',
      country_jp: 'パナマ',
      country_en: 'Panama',
      flagEmoji: '🇵🇦',
      company: 'Brisa and Tierra',
      email: ''
    },
    {
      id: 'taiwan',
      country_jp: '台湾',
      country_en: 'Taiwan',
      flagEmoji: '🇹🇼',
      company: 'ORIOWL',
      email: ''
    },
    {
      id: 'costarica',
      country_jp: 'コスタリカ',
      country_en: 'Costa Rica',
      flagEmoji: '🇨🇷',
      company: 'PuraVida',
      email: ''
    },
    {
      id: 'indonesia',
      country_jp: 'インドネシア',
      country_en: 'Indonesia',
      flagEmoji: '🇮🇩',
      company: 'Rational Idea',
      email: ''
    },
    {
      id: 'colombia',
      country_jp: 'コロンビア',
      country_en: 'Colombia',
      flagEmoji: '🇨🇴',
      company: '',           // 会社名は決定次第ご記入ください
      comingSoon: true,
      email: ''
    }
  ]
};
