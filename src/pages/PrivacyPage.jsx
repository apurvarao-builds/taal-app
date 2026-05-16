export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gold mb-1">Privacy Policy</h1>
        <p className="text-xs text-muted mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-sm text-text-sub leading-relaxed">
          <p>
            <strong className="text-text-main">Taal</strong> is a personal Kathak practice journal.
            This policy explains what data we collect and how it is used.
          </p>

          <section>
            <h2 className="text-base font-semibold text-text-main mb-3">What we collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-text-main">Email address</strong> - used to create and authenticate your account</li>
              <li><strong className="text-text-main">Audio recordings</strong> - practice recordings you choose to upload or record in the app</li>
              <li><strong className="text-text-main">Journal entries</strong> - notes, titles, dates, moods, and project data you create</li>
              <li><strong className="text-text-main">Profile information</strong> - display name, gharana, guru name, and practice preferences you optionally provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-main mb-3">What we do not collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>We do not collect location data</li>
              <li>We do not run advertising or analytics trackers</li>
              <li>We do not sell, share, or monetise your data in any way</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-main mb-3">How your data is stored</h2>
            <p>
              All data is stored securely in Supabase, a hosted database and storage platform.
              Audio files are stored in Supabase Storage. Data is associated with your account
              and is not accessible to other users.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-main mb-3">Third-party services</h2>
            <p>
              Taal uses the <strong className="text-text-main">Spotify API</strong> to suggest
              practice tracks based on your detected BPM. This feature does not require a Spotify
              login and does not share any of your personal data with Spotify. We use Spotify's
              public search API only.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-main mb-3">Your rights</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You can update or delete your profile information at any time from the Profile page</li>
              <li>You can delete individual journal entries and recordings within the app</li>
              <li>To delete your account and all associated data, contact us at the email below</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-main mb-3">Contact</h2>
            <p>
              For any privacy questions:{' '}
              <a href="mailto:apurvarao09@gmail.com" className="text-gold hover:text-gold-light transition-colors">
                apurvarao09@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
