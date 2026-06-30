import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hospital MIS - Healthcare Management',
    short_name: 'HospMIS',
    description: 'Complete Hospital Management Information System',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'any',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/dashboard.png',
        sizes: '1280x720',
        type: 'image/png',
        },
    ],
    categories: ['medical', 'business', 'productivity'],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'New Patient',
        short_name: 'Patient',
        description: 'Register a new patient',
        url: '/dashboard/patients/new',
        icons: [{ src: '/icons/patient.png', sizes: '96x96' }],
      },
      {
        name: 'Appointments',
        short_name: 'Appointments',
        description: 'View today\'s appointments',
        url: '/dashboard/appointments',
        icons: [{ src: '/icons/calendar.png', sizes: '96x96' }],
      },
    ],
  };
}