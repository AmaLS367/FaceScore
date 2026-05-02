import type { AnalysisReport } from './analysis';

export const fixtureReport: AnalysisReport = {
  overallScore: {
    value: 82,
    label: 'Strong baseline',
    summary:
      'Balanced facial proportions with a clear grooming upside. The strongest gains are in lighting, skin texture presentation, and sharper styling choices.',
  },
  scoreCategories: [
    {
      id: 'symmetry',
      label: 'Symmetry',
      value: 84,
      summary: 'The face reads balanced at first glance.',
      details: ['Eye line and jaw balance are strong.', 'Minor angle and lighting differences affect perceived symmetry.'],
    },
    {
      id: 'proportions',
      label: 'Proportions',
      value: 80,
      summary: 'Facial thirds and feature spacing are visually coherent.',
      details: ['Midface proportion is favorable.', 'Camera distance should avoid widening the lower face.'],
    },
    {
      id: 'skin',
      label: 'Skin',
      value: 76,
      summary: 'Skin presentation is good but sensitive to harsh lighting.',
      details: ['Even tone is a strength.', 'Softer light would reduce texture emphasis.'],
    },
    {
      id: 'grooming',
      label: 'Grooming',
      value: 86,
      summary: 'Grooming is already a clear advantage.',
      details: ['Hair shape frames the face well.', 'Sharper neckline cleanup would improve polish.'],
    },
    {
      id: 'style',
      label: 'Style',
      value: 83,
      summary: 'Style direction supports the face shape.',
      details: ['Structured collars and darker solids work well.', 'Avoid flat overhead lighting in profile images.'],
    },
  ],
  strengths: [
    'Balanced overall facial structure',
    'Good grooming foundation',
    'Strong potential for high-quality profile photos with better lighting',
  ],
  recommendations: [
    {
      title: 'Define the grooming baseline',
      priority: 'high',
      detail: 'Keep hair volume controlled at the sides and clean the neckline before important photos.',
    },
    {
      title: 'Use softer front lighting',
      priority: 'medium',
      detail: 'Face a window or diffused light source to reduce texture shadows and improve skin presentation.',
    },
    {
      title: 'Shoot from eye level',
      priority: 'medium',
      detail: 'Avoid low camera angles because they distort jaw and nose proportions.',
    },
  ],
  groomingNotes: ['Maintain a neat neckline.', 'Use matte styling products to avoid shine.'],
  styleNotes: ['Prefer structured tops.', 'Use simple backgrounds so the face remains the focus.'],
};
