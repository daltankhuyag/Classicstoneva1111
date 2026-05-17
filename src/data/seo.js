export const SITE_NAME = 'Classic Stone'

export const DEFAULT_SEO = {
  title: 'Classic Stone | Design & Build in Virginia',
  description:
    'Classic Stone designs, builds, and remodels homes across Virginia with custom natural stone, thoughtful planning, and lasting craftsmanship.',
  image: '/HERO_IMAGE.png',
  type: 'website',
}

export const SEO_PAGES = [
  {
    path: '/',
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    changeFrequency: 'weekly',
    priority: '1.0',
  },
  {
    path: '/floor-plans',
    title: 'Floor Plans & Designs | Classic Stone',
    description:
      'Explore Classic Stone floor plans and custom home designs built for the way Virginia families live.',
    changeFrequency: 'monthly',
    priority: '0.9',
  },
  {
    path: '/gallery',
    title: 'Project Gallery | Classic Stone',
    description:
      'Browse recent Classic Stone project work across kitchens, hospitality spaces, and custom installations in Virginia.',
    changeFrequency: 'weekly',
    priority: '0.8',
  },
  {
    path: '/remodeling',
    title: 'Home Remodeling | Classic Stone',
    description:
      'See how Classic Stone approaches thoughtful Virginia home remodeling, from focused updates to whole-home transformations.',
    changeFrequency: 'monthly',
    priority: '0.8',
  },
  {
    path: '/schedule',
    title: 'Schedule a Consultation | Classic Stone',
    description:
      'Book a free consultation with Classic Stone for a Virginia custom build, remodeling project, or natural stone installation.',
    changeFrequency: 'monthly',
    priority: '0.7',
  },
  {
    path: '/stone-gallery',
    title: 'Stone Gallery | Classic Stone',
    description:
      'Browse granite, quartz, quartzite, marble, soapstone, and other natural stone options from Classic Stone.',
    changeFrequency: 'weekly',
    priority: '0.8',
  },
]

export function getPageSeo(path) {
  return SEO_PAGES.find(page => page.path === path) || SEO_PAGES[0]
}