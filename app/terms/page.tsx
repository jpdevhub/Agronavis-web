import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/ui/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'What you can expect from Agronavis, what we expect from you, how billing and cancellation work, and the limits of satellite-derived advice.',
};

const summary = [
  'Use the product for your own farming or business. Do not resell our data or attack our systems.',
  'Paid plans are monthly. Cancel any time from the app and you keep access until the period ends.',
  'Our analysis is decision support, not a guarantee. You still make the call on your own field.',
];

const sections: LegalSection[] = [
  {
    heading: 'Agreeing to these terms',
    paragraphs: [
      'By creating an account or using Agronavis, you agree to what is written here. If you are accepting on behalf of a company, co-operative or government body, you are confirming you have the authority to do that.',
    ],
  },
  {
    heading: 'Your account',
    paragraphs: [
      'Keep your login credentials to yourself, and tell us quickly if you think someone else has them. You are responsible for what happens under your account.',
      'One account per person. Enterprise deployments get proper multi-user access with roles, so there is no reason to share a login.',
    ],
  },
  {
    heading: 'Acceptable use',
    paragraphs: ['Do not do any of the following. It is a short list and none of it should be surprising.'],
    bullets: [
      'Scrape, resell, or redistribute our satellite-derived data as your own product.',
      'Reverse engineer the platform, or probe, scan or stress-test our infrastructure without written permission.',
      'Upload field boundaries for land you have no legitimate interest in, or use the product to surveil someone else.',
      'Use the consult network to obtain advice you then republish commercially as your own.',
    ],
  },
  {
    heading: 'What we promise',
    paragraphs: [
      'We will keep the platform running, keep your data private as described in our privacy policy, and tell you honestly when something breaks. We publish incidents rather than hiding them, and we will not quote an availability figure we are not yet measuring.',
    ],
  },
  {
    heading: 'What we do not promise',
    paragraphs: [
      'Satellite analysis is decision support. It is accurate, it is validated across sensors, and it is still a model of reality rather than reality. Weather, pests, equipment, market prices and luck all remain outside our control.',
      'We do not guarantee any particular yield, saving, or outcome, and nothing in the product is financial, legal or insurance advice. You remain the person who decides what happens on your land.',
    ],
  },
  {
    heading: 'Free and paid plans',
    paragraphs: [
      'The Civilian plan is free and stays free for the coverage it describes. Paid plans are billed monthly in advance. Prices are shown inclusive of applicable taxes where required.',
      'Cancel at any time from your account. You keep access until the end of the period you already paid for, and we do not pro-rate partial months. If we raise a price, existing subscribers get 30 days notice and the option to leave before it applies.',
    ],
  },
  {
    heading: 'Consult sessions',
    paragraphs: [
      'Per-minute consult sessions are billed on the time actually used, rounded to the nearest minute. Experts in the network are independent professionals, not our employees; we vet their credentials but the advice they give is theirs.',
      'If a session fails for technical reasons on our side, we refund it. Ask and it is done, no argument.',
    ],
  },
  {
    heading: 'Your data and your content',
    paragraphs: [
      'Field boundaries, crop records and anything else you put in stay yours. You give us the licence needed to process it and show it back to you, and nothing more. We may use aggregated, de-identified patterns to improve the models; that never identifies you or your land.',
    ],
  },
  {
    heading: 'Suspension',
    paragraphs: [
      'We can suspend an account that is attacking our systems, abusing the consult network, or seriously in breach of these terms. Where the situation allows it, we warn first and explain what needs to change.',
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'To the extent the law allows, our total liability in any twelve-month period is limited to what you paid us in that period. We are not liable for indirect or consequential losses such as lost profit or lost harvest. Nothing here limits liability for fraud, or for anything that cannot legally be limited.',
    ],
  },
  {
    heading: 'Changes to these terms',
    paragraphs: [
      'We will give 30 days notice by email before any material change takes effect. Continuing to use the product after that means you accept the new version. If you do not, cancel and we will refund the unused part of your current period.',
    ],
  },
  {
    heading: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of India, and the courts of Bengaluru have exclusive jurisdiction over any dispute. We would obviously rather sort it out over a phone call.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="The deal, in readable English."
      intro="Terms of service, minus the wall of capital letters. If something here seems unfair, tell us. Most of this document exists because somebody asked a fair question."
      updated="16 September 2026"
      summary={summary}
      sections={sections}
      contact={{
        line: 'Contract questions, enterprise redlines, or a clause you want explained in normal words.',
        email: 'contact@agronavis.in',
      }}
    />
  );
}
