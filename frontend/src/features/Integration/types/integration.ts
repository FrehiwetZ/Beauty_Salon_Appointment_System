export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'Connected' | 'Disconnected';
  icon: string; // URL or identifier for an icon
}
