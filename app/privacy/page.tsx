import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What Agronavis collects, why we collect it, who we never sell it to, and how to get it deleted. Written to be read, not skimmed past.',
};

const summary = [
  'We do not sell your data. Not to input sellers, not to lenders, not to anyone.',
  'Your field boundaries and crop history belong to you. Export or delete them whenever you want.',
  'We collect the minimum needed to run the product, and we say exactly what that is below.',
];

const sections: LegalSection[] = [
  {
    heading: 'What we collect',
    paragraphs: [
      'Three kinds of information, and nothing beyond what the product needs to work.',
    ],
    bullets: [
      'Account details: your name, email, an optional phone number and photograph, your village, district and state, your preferred language, and how you farm: irrigation type, soil type and the crops you grow.',
      'Field data: the boundaries you draw and their calculated area, the crops you plant and when, tasks you complete, photographs you scan, posts you write, and the satellite-derived measurements we generate for those areas.',
      'Usage data: which screens you open and which alerts you act on, so we know what is working. This is aggregated and never sold.',
    ],
  },
  {
    heading: 'What we do not collect',
    paragraphs: [
      'We do not collect your contacts, call logs, SMS, installed applications, browsing history or advertising identifiers. We do not track your location in the background. We do not browse your photo library: the app only ever receives an individual picture you choose to send. We do not buy data about you from brokers, and we do not fingerprint your device across other websites.',
    ],
  },
  {
    heading: 'Permissions the app asks for',
    paragraphs: [
      'The app asks before using any of these. Each is used only while you are in the part of the app that needs it, and none of them runs in the background. Refusing one leaves the rest of the app working, and you can change your mind at any time in your device settings.',
    ],
    bullets: [
      'Camera: to photograph a leaf for a disease reading. That photograph is sent to our server to be identified, and kept against your account so you can look back at it.',
      'Photos: only the picture you pick yourself, when you choose one from your gallery instead of taking it. We do not read the rest of your library.',
      'Microphone: only while you hold the microphone button to speak to Sahayak. Your speech is turned into text on your own phone, and the recording is not kept and never reaches us.',
      'Location: read when you tap the locate button while mapping a field, and to work out which district the field sits in. Never read in the background.',
      'Notifications: to deliver alerts you have switched on, such as smoke from stubble fires upwind of your field.',
    ],
  },
  {
    heading: 'Your conversations stay on your phone',
    paragraphs: [
      'Sahayak runs a language model on your device. What you ask it, and what it answers, is processed on the handset and never sent to us or to anyone else. The farm details it reads in order to answer usefully are held in a copy on the phone.',
      'Speech recognition and speech output use your own device services, governed by your phone settings rather than by us.',
    ],
  },
  {
    heading: 'Field boundaries',
    paragraphs: [
      'A field boundary is the precise location of someone\'s livelihood. We treat it as the most sensitive thing we hold. It is never shared with advertisers and never sold.',
    ],
  },
  {
    heading: 'Why we collect it',
    paragraphs: [
      'To generate the analysis you asked for, to send alerts about your fields, to connect you to a consult expert when you request one, and to bill you if you are on a paid plan. That is the complete list.',
      'We also use aggregated, de-identified patterns to improve our models. Aggregated means your field cannot be picked out of it.',
    ],
  },
  {
    heading: 'Who we share it with',
    paragraphs: [
      'Nobody who pays us for it, because nobody pays us for it. We share data only in these cases:',
    ],
    bullets: [
      'Service providers who run our infrastructure (hosting, SMS and email delivery, payment processing) under contracts that forbid using your data for anything else.',
      'A consult expert you choose to talk to, who sees only the fields relevant to your question and only for that consultation.',
      'Law enforcement or a court, where a valid legal order requires it. We will tell you unless we are legally barred from doing so.',
    ],
  },
  {
    heading: 'How long we keep it',
    paragraphs: [
      'Field data stays while your account is open, because historical comparison is the entire point of the product. Delete your account and we remove your personal data and field boundaries within 30 days from live systems, and within 90 days from encrypted backups.',
      'Billing records are kept for seven years, because tax law requires it.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'You can ask us to show you everything we hold about you, correct anything wrong, export your field data in a standard format, or delete the lot. To delete, open Profile in the app and choose Delete My Account, directly below Log Out.',
      'You can also request deletion without opening the app, including after uninstalling it, at agronavis.in/delete-account. No login is required. We action it within 30 days and write to confirm when it is done.',
      'You can also withdraw consent for marketing messages at any time without losing access to the product.',
    ],
  },
  {
    heading: 'Security',
    paragraphs: [
      'Data is encrypted in transit and at rest. Access by our staff is role-limited and logged, and engineers do not get production access by default. If we ever suffer a breach that affects you, we will tell you what happened, what was exposed, and what we are doing about it, within 72 hours of confirming it.',
    ],
  },
  {
    heading: 'Cookies and analytics',
    paragraphs: [
      'We use a session cookie to keep you logged in and a privacy-respecting analytics tool that does not follow you around other sites. No advertising trackers, no third-party pixels.',
    ],
  },
  {
    heading: 'Children',
    paragraphs: [
      'Agronavis is not intended for anyone under 18. We do not knowingly collect data from children, and we delete it if we discover we have.',
    ],
  },
  {
    heading: 'Changes to this policy',
    paragraphs: [
      'If we change anything that materially affects you, we will email you and show a notice in the app before it takes effect. We will not quietly update this page and hope you do not notice.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Your field data stays yours."
      intro="This is the full privacy policy. It is written in plain language on purpose, because a policy nobody can read is not consent, it is decoration."
      updated="16 September 2026"
      summary={summary}
      sections={sections}
      contact={{
        line: 'Ask us anything about your data, including the awkward questions. A human replies, usually within two working days.',
        email: 'contact@agronavis.in',
      }}
    />
  );
}
