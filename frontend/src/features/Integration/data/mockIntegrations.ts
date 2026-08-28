import { Integration } from '../types/integration';

export const mockIntegrations: Integration[] = [
  {
    id: 'int-1',
    name: 'Google Calendar',
    description: 'Sync your appointments automatically with Google Calendar.',
    status: 'Connected',
    icon: '📅'
  },
  {
    id: 'int-2',
    name: 'Stripe',
    description: 'Accept payments securely online via Stripe.',
    status: 'Disconnected',
    icon: '💳'
  },
  {
    id: 'int-3',
    name: 'Mailchimp',
    description: 'Sync your customer emails for marketing campaigns.',
    status: 'Connected',
    icon: '✉️'
  },
  {
    id: 'int-4',
    name: 'Zoom',
    description: 'Generate meeting links for virtual consultations.',
    status: 'Disconnected',
    icon: '📹'
  }
];
