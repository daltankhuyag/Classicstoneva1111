import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const TYPE_COLORS = {
  granite: { bg: '#2c2c2a', fg: '#d3d1c7', pill: '#f1efe8', pillFg: '#444441' },
  quartz: { bg: '#185fa5', fg: '#e6f1fb', pill: '#e6f1fb', pillFg: '#0c447c' },
  quartzite: { bg: '#7f77dd', fg: '#eeedfe', pill: '#eeedfe', pillFg: '#3c3489' },
  marble: { bg: '#993556', fg: '#fbeaf0', pill: '#fbeaf0', pillFg: '#72243e' },
  soapstone: { bg: '#0f6e56', fg: '#e1f5ee', pill: '#e1f5ee', pillFg: '#085041' },
}

const STONES = [
  {
    name: 'Absolute Black',
    origin: 'South India',
    type: 'granite',
    image: '/granite/Absolute_Black.jpg',
    useLabels: ['Countertop', 'Flooring', 'Accent wall'],
    desc: 'Pure jet-black with minimal variation. Mirror-like polished sheen. Pairs brilliantly with white cabinetry and brass hardware. One of the most popular choices for modern and contemporary kitchens.',
    bg: '#1e1e1e',
    speckle: [['#3a3a3a', 0.4], ['#111111', 0.3]],
    maint: 'Seal annually',
    best: 'Modern kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Alaska White',
    origin: 'Brazil',
    type: 'granite',
    image: '/granite/Alaska_white.jpg',
    useLabels: ['Countertop', 'Island', 'Vanity'],
    desc: 'Bright white granite with cool gray movement and subtle mineral contrast. A strong fit for airy kitchens that want a crisp look with natural variation.',
    bg: '#d9ddd8',
    speckle: [['#b0b8b5', 0.26], ['#6e7675', 0.18], ['#ecefed', 0.22]],
    maint: 'Seal every 1-2 years',
    best: 'Light, bright kitchens',
    dur: 'Very good',
  },
  {
    name: 'Aspen Sky',
    origin: 'Brazil',
    type: 'granite',
    image: '/granite/Aspen_Sky.jpg',
    useLabels: ['Statement countertop', 'Floor', 'Feature wall'],
    desc: 'Soft white and silver granite with flowing gray-blue movement. It brings a cooler palette and a refined natural pattern to contemporary spaces.',
    bg: '#cfd7de',
    speckle: [['#7c8fa3', 0.28], ['#dbe4ea', 0.24], ['#9eabb9', 0.2]],
    maint: 'Seal annually',
    best: 'Contemporary kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Blue Elegance',
    origin: 'Norway',
    type: 'granite',
    image: '/granite/Blue_elegance.jpg',
    useLabels: ['Countertop', 'Floor tile', 'Backsplash pairing'],
    desc: 'A dramatic blue-gray granite with layered movement and a premium polished finish. It works especially well where the stone needs to carry the design visually.',
    bg: '#5d7184',
    speckle: [['#c9d5df', 0.15], ['#304050', 0.26], ['#7890a6', 0.28]],
    maint: 'Seal every 2 years',
    best: 'Statement islands',
    dur: 'Very good',
  },
  {
    name: 'Lundhs Blue',
    origin: 'Norway',
    type: 'granite',
    image: '/granite/Lundhs_blue.jpg',
    useLabels: ['Countertop', 'Outdoor kitchen', 'Flooring'],
    desc: 'Dense blue stone with crystalline texture and rich mineral depth. Its cooler tone and durability make it a standout option for both interiors and exposed exterior applications.',
    bg: '#526474',
    speckle: [['#93a7b8', 0.18], ['#2c3a46', 0.3], ['#71879a', 0.24]],
    maint: 'Seal annually',
    best: 'Interior and exterior use',
    dur: 'Excellent',
  },
  {
    name: 'Pretoria',
    origin: 'Brazil',
    type: 'granite',
    image: '/granite/Pretoria.jpeg',
    useLabels: ['Countertop', 'Floor', 'Vanity'],
    desc: 'Warm granite with layered neutrals and bold natural contrast. It lends depth to kitchens and baths that need an inviting, grounded palette.',
    bg: '#8e7766',
    speckle: [['#c7b29a', 0.18], ['#5f4b3d', 0.28], ['#9f8978', 0.24]],
    maint: 'Seal every 1-2 years',
    best: 'Warm transitional interiors',
    dur: 'Very good',
  },
  {
    name: 'Black Jasper',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Black Jasper.jpg',
    useLabels: ['Countertop', 'Island', 'Vanity'],
    desc: 'A bold black quartz surface with rich depth and a refined polished finish. Ideal for dramatic kitchens, vanities, and statement islands.',
    bg: '#1b1c1f',
    speckle: [['#3f4044', 0.25], ['#111214', 0.28], ['#5b5e64', 0.15]],
    maint: 'None required',
    best: 'Dramatic modern kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Calacatta Galaxy',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Calacatta Galaxy.jpg',
    useLabels: ['Countertop', 'Feature island', 'Backsplash'],
    desc: 'Bright white quartz with expressive gray movement and a premium Calacatta-inspired look. Designed for elegant, low-maintenance kitchens.',
    bg: '#efeeea',
    speckle: [['#aeb2b7', 0.24], ['#d9dbdd', 0.2], ['#8e949a', 0.14]],
    maint: 'None required',
    best: 'Luxury family kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Calacatta Gold',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Calacatta Gold.jpg',
    useLabels: ['Countertop', 'Island', 'Vanity'],
    desc: 'Classic white quartz animated by gray and warm gold veining. A strong option for kitchens that want a bright stone with softer warmth.',
    bg: '#f2efe8',
    speckle: [['#c8b079', 0.2], ['#999da1', 0.2], ['#ddd7cc', 0.2]],
    maint: 'None required',
    best: 'Warm bright interiors',
    dur: 'Excellent',
  },
  {
    name: 'Calacatta Tree',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Calacatta Tree.jpg',
    useLabels: ['Countertop', 'Feature wall', 'Vanity'],
    desc: 'White quartz with branching linear veining that creates a more graphic Calacatta pattern. Works well as a visual focal point.',
    bg: '#f0efec',
    speckle: [['#9da3a8', 0.18], ['#d6d8da', 0.2], ['#b8bec4', 0.14]],
    maint: 'None required',
    best: 'Statement wall applications',
    dur: 'Excellent',
  },
  {
    name: 'Cemento',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Cemento.jpg',
    useLabels: ['Countertop', 'Vanity', 'Accent wall'],
    desc: 'A concrete-inspired quartz with a soft industrial tone and consistent surface character. Ideal for modern and minimalist interiors.',
    bg: '#a8a59f',
    speckle: [['#7d7b76', 0.2], ['#c8c5bf', 0.18], ['#96938d', 0.24]],
    maint: 'None required',
    best: 'Modern minimalist spaces',
    dur: 'Excellent',
  },
  {
    name: 'Dry Concrete',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Dry Concrete.jpg',
    useLabels: ['Countertop', 'Island', 'Wall cladding'],
    desc: 'A cool gray quartz with a restrained cement-like finish. It pairs well with wood, matte black fixtures, and clean architectural lines.',
    bg: '#b8b5b0',
    speckle: [['#8d8a86', 0.24], ['#d6d2cd', 0.16], ['#a29f9a', 0.2]],
    maint: 'None required',
    best: 'Industrial-inspired kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Frozen Lava',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Frozen Lava.jpg',
    useLabels: ['Countertop', 'Feature island', 'Vanity'],
    desc: 'Dark quartz with layered contrast and a moody contemporary character. A strong choice for high-impact islands and rich tonal palettes.',
    bg: '#2b2d31',
    speckle: [['#5f646c', 0.2], ['#15171a', 0.28], ['#8a9096', 0.12]],
    maint: 'None required',
    best: 'Bold contemporary kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Gris Ardoise',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Gris Ardoise.jpg',
    useLabels: ['Countertop', 'Bathroom wall', 'Vanity'],
    desc: 'A slate-toned quartz with subtle depth and a refined neutral base. It works beautifully in kitchens and baths that lean cool and modern.',
    bg: '#6d737b',
    speckle: [['#8f98a0', 0.18], ['#495159', 0.26], ['#b3bcc2', 0.1]],
    maint: 'None required',
    best: 'Cool-toned interiors',
    dur: 'Excellent',
  },
  {
    name: 'Infinity',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Infinity.jpg',
    useLabels: ['Countertop', 'Island', 'Backsplash'],
    desc: 'Clean quartz with bright movement and a polished premium look. A versatile fit for both transitional and contemporary spaces.',
    bg: '#eceae6',
    speckle: [['#b0b4b8', 0.2], ['#d7dadc', 0.18], ['#949aa0', 0.14]],
    maint: 'None required',
    best: 'Versatile kitchen palettes',
    dur: 'Excellent',
  },
  {
    name: 'Invisible White',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Invisible White.jpg',
    useLabels: ['Countertop', 'Vanity', 'Feature wall'],
    desc: 'Bright white quartz with elegant movement that stays light and airy. Ideal for spaces that want a crisp, upscale finish.',
    bg: '#f3f2ef',
    speckle: [['#c9cdcf', 0.18], ['#e8e9e7', 0.2], ['#a4a8ad', 0.12]],
    maint: 'None required',
    best: 'Airy upscale interiors',
    dur: 'Excellent',
  },
  {
    name: 'Jade Silk',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Jade Silk.jpg',
    useLabels: ['Countertop', 'Vanity', 'Accent wall'],
    desc: 'A softer quartz with silk-like movement and a gentle designer palette. It adds a calmer, more custom tone to kitchens and baths.',
    bg: '#cfd4cb',
    speckle: [['#a6b0a5', 0.18], ['#e2e7df', 0.16], ['#8c968c', 0.14]],
    maint: 'None required',
    best: 'Soft contemporary palettes',
    dur: 'Excellent',
  },
  {
    name: 'Mikado Grey',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Mikado Grey.jpg',
    useLabels: ['Countertop', 'Island', 'Wall cladding'],
    desc: 'A balanced medium-gray quartz that bridges warm and cool finishes easily. Useful for understated kitchens that still need depth.',
    bg: '#98999b',
    speckle: [['#c8c8c9', 0.16], ['#75777a', 0.22], ['#aeb0b2', 0.16]],
    maint: 'None required',
    best: 'Neutral transitional spaces',
    dur: 'Excellent',
  },
  {
    name: 'Nero Marquina',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Nero Marquina.jpg',
    useLabels: ['Countertop', 'Feature island', 'Vanity'],
    desc: 'Black quartz with striking white veining inspired by the marble classic. It brings a bold luxury look with easier upkeep.',
    bg: '#141518',
    speckle: [['#f1f1f1', 0.16], ['#c8c8c8', 0.12], ['#2f3135', 0.26]],
    maint: 'None required',
    best: 'Luxury contrast designs',
    dur: 'Excellent',
  },
  {
    name: 'Serenity Gold',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Serenity Gold.jpg',
    useLabels: ['Countertop', 'Island', 'Backsplash'],
    desc: 'White quartz with elegant gold-accented movement designed to warm up bright kitchens and refined bathroom palettes.',
    bg: '#f2ede5',
    speckle: [['#ceb483', 0.18], ['#b8bcc0', 0.16], ['#e2ddd5', 0.18]],
    maint: 'None required',
    best: 'Warm luxury kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Statuario Picasso',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Statuario Picasso.JPG',
    useLabels: ['Countertop', 'Vanity', 'Feature wall'],
    desc: 'A statuario-style quartz with expressive artistic veining. Strong enough to anchor statement kitchens while staying easy to maintain.',
    bg: '#efefed',
    speckle: [['#babdc1', 0.18], ['#e1e2e0', 0.18], ['#8f9498', 0.12]],
    maint: 'None required',
    best: 'Statement interior surfaces',
    dur: 'Excellent',
  },
  {
    name: 'Tranquility Gold',
    origin: 'Engineered Quartz',
    type: 'quartz',
    image: '/Quartz/Tranquility Gold.jpg',
    useLabels: ['Countertop', 'Island', 'Vanity'],
    desc: 'A bright quartz with graceful gold and gray movement for homes that want warmth without sacrificing a clean modern surface.',
    bg: '#f3eee6',
    speckle: [['#ccb487', 0.17], ['#a9afb4', 0.15], ['#e4ded6', 0.18]],
    maint: 'None required',
    best: 'Soft warm contemporary interiors',
    dur: 'Excellent',
  },
  {
    name: 'Arabescato Corchia',
    origin: 'Italy',
    type: 'quartzite',
    image: '/Quarztzite/Arabescato Corchia.jpg',
    useLabels: ['Countertop', 'Feature wall', 'Floor'],
    desc: 'A bright white stone with elegant gray veining and a highly architectural look. Ideal where a marble-like statement is needed with stronger performance.',
    bg: '#ecebea',
    speckle: [['#b5b8bd', 0.2], ['#dfe2e5', 0.18], ['#969aa0', 0.12]],
    maint: 'Seal every 1-2 years',
    best: 'Marble-look feature spaces',
    dur: 'Very good',
  },
  {
    name: 'Calacatta Gold Classic',
    origin: 'Italy',
    type: 'quartzite',
    image: '/Quarztzite/Calacatta Gold Classic.jpg',
    useLabels: ['Countertop', 'Vanity', 'Feature wall'],
    desc: 'A luminous white quartzite with flowing gray and gold veining. It brings warmth and a premium natural look to kitchens and statement islands.',
    bg: '#efe9df',
    speckle: [['#ccb384', 0.18], ['#b0b4b8', 0.16], ['#dfd8cc', 0.18]],
    maint: 'Seal every 1-2 years',
    best: 'Warm luxury kitchens',
    dur: 'Very good',
  },
  {
    name: 'Calacatta Vagli',
    origin: 'Italy',
    type: 'quartzite',
    image: '/Quarztzite/Calacatta Vagli.jpg',
    useLabels: ['Feature countertop', 'Vanity', 'Island'],
    desc: 'A white quartzite with strong linear movement and a more dramatic high-end Calacatta expression. Best used where the stone can take visual priority.',
    bg: '#eeece9',
    speckle: [['#a8adb2', 0.18], ['#d7dadd', 0.18], ['#8d9298', 0.12]],
    maint: 'Seal every 1-2 years',
    best: 'Statement islands and vanities',
    dur: 'Very good',
  },
  {
    name: 'Grigio Carnico',
    origin: 'Italy',
    type: 'quartzite',
    image: '/Quarztzite/Grigio Carnico.jpg',
    useLabels: ['Countertop', 'Accent wall', 'Vanity'],
    desc: 'A dark, richly veined surface with deep charcoal tones and bold contrast. It creates strong visual impact in luxury interiors.',
    bg: '#2b2d32',
    speckle: [['#9599a3', 0.14], ['#111318', 0.3], ['#5f6670', 0.18]],
    maint: 'Seal every 1-2 years',
    best: 'High-contrast luxury interiors',
    dur: 'Very good',
  },
  {
    name: 'Leaden Sky Gold',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Leaden Sky Gold.jpg',
    useLabels: ['Countertop', 'Island', 'Feature wall'],
    desc: 'A moody stone with layered gray movement and subtle warm gold accents. It suits interiors that want softness and drama at the same time.',
    bg: '#87827c',
    speckle: [['#d2c1a1', 0.12], ['#6d6963', 0.24], ['#aba49d', 0.16]],
    maint: 'Seal every 1-2 years',
    best: 'Soft dramatic kitchens',
    dur: 'Very good',
  },
  {
    name: 'Orca',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Orca.jpg',
    useLabels: ['Countertop', 'Vanity', 'Accent wall'],
    desc: 'A striking black-and-white quartzite with graphic movement that reads almost artistic. Perfect for strong statement applications.',
    bg: '#25272b',
    speckle: [['#ececec', 0.14], ['#111214', 0.26], ['#8a8d92', 0.16]],
    maint: 'Seal every 1-2 years',
    best: 'Graphic statement spaces',
    dur: 'Very good',
  },
  {
    name: 'Patagonia Blue',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Patagonia Blue.jpg',
    useLabels: ['Feature island', 'Wall panel', 'Countertop'],
    desc: 'A highly expressive quartzite with blue-gray crystalline movement and premium visual depth. Best where the slab itself becomes the focal point.',
    bg: '#6c7f93',
    speckle: [['#cfd9e3', 0.14], ['#496074', 0.22], ['#93a8bb', 0.18]],
    maint: 'Seal every 1-2 years',
    best: 'Feature islands and walls',
    dur: 'Very good',
  },
  {
    name: 'Sahara Noir',
    origin: 'Tunisia',
    type: 'quartzite',
    image: '/Quarztzite/Sahara Noir.jpg',
    useLabels: ['Countertop', 'Feature wall', 'Vanity'],
    desc: 'A deep black stone animated by warm white and gold veining. It gives interiors a dramatic luxury feel with strong contrast.',
    bg: '#18191b',
    speckle: [['#d7c09a', 0.12], ['#f0ede7', 0.1], ['#2d2f33', 0.24]],
    maint: 'Seal every 1-2 years',
    best: 'Luxury statement interiors',
    dur: 'Very good',
  },
  {
    name: 'Silver Brown Wave',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Silver Brown Wave.jpg',
    useLabels: ['Countertop', 'Floor', 'Feature wall'],
    desc: 'A layered quartzite with sweeping movement across warm silver-brown tones. It adds natural rhythm and warmth to larger surfaces.',
    bg: '#9a8775',
    speckle: [['#c8b7a7', 0.16], ['#6f6256', 0.24], ['#aa9888', 0.18]],
    maint: 'Seal every 1-2 years',
    best: 'Large-format feature areas',
    dur: 'Very good',
  },
  {
    name: 'Skyline',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Skyline.jpg',
    useLabels: ['Countertop', 'Island', 'Backsplash'],
    desc: 'A cool, linear quartzite with soft movement and a refined modern palette. Useful for projects that need calm visual texture.',
    bg: '#c9ced2',
    speckle: [['#edf0f1', 0.12], ['#a5adb4', 0.18], ['#838c94', 0.16]],
    maint: 'Seal every 1-2 years',
    best: 'Calm modern interiors',
    dur: 'Very good',
  },
  {
    name: 'Taj Mahal',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Taj Mahal.jpg',
    useLabels: ['Countertop', 'Vanity', 'Feature wall'],
    desc: 'A creamy white-gold quartzite with soft movement and a warm, elegant palette. One of the most sought-after options for timeless kitchens.',
    bg: '#ddd0b6',
    speckle: [['#bba67e', 0.18], ['#efe7d8', 0.16], ['#93805f', 0.14]],
    maint: 'Seal every 1-2 years',
    best: 'Warm timeless kitchens',
    dur: 'Very good',
  },
  {
    name: 'Tropical Storm',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Tropical Storm.jpg',
    useLabels: ['Countertop', 'Feature wall', 'Island'],
    desc: 'A stormy, high-movement quartzite with rich contrast and layered texture. It works best in applications where the slab can become the centerpiece.',
    bg: '#4d5558',
    speckle: [['#d4d7d6', 0.1], ['#2a3033', 0.24], ['#7c8688', 0.18]],
    maint: 'Seal every 1-2 years',
    best: 'High-drama focal surfaces',
    dur: 'Very good',
  },
  {
    name: 'Venom',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Venom.jpg',
    useLabels: ['Countertop', 'Vanity', 'Accent wall'],
    desc: 'A dark quartzite with sharp, high-contrast movement and a bold modern feel. Designed for spaces that want a striking stone identity.',
    bg: '#232528',
    speckle: [['#d9dada', 0.12], ['#111214', 0.28], ['#5e6268', 0.16]],
    maint: 'Seal every 1-2 years',
    best: 'Bold contemporary interiors',
    dur: 'Very good',
  },
  {
    name: 'Vivid Green',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/Quarztzite/Vivid Green.jpg',
    useLabels: ['Feature countertop', 'Accent wall', 'Vanity'],
    desc: 'A lush green quartzite with dramatic natural movement and luxury presence. Best used when the stone is intended to lead the palette.',
    bg: '#406050',
    speckle: [['#9fb8aa', 0.14], ['#22372e', 0.24], ['#678674', 0.18]],
    maint: 'Seal every 1-2 years',
    best: 'Designer statement spaces',
    dur: 'Very good',
  },
]

const TYPES = [
  ['all', 'All types'],
  ['granite', 'Granite'],
  ['quartz', 'Quartz'],
  ['quartzite', 'Quartzite'],
  ['marble', 'Marble'],
  ['soapstone', 'Soapstone'],
]

const STONES_PER_PAGE = 8

function drawSwatch(canvas, stone, height) {
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  const width = canvas.clientWidth || canvas.offsetWidth || 500
  canvas.width = width
  canvas.height = height

  context.fillStyle = stone.bg
  context.fillRect(0, 0, width, height)

  for (const [color, density] of stone.speckle || []) {
    context.fillStyle = color
    const dotCount = Math.max(24, Math.round(width * height * density * 0.015))

    for (let index = 0; index < dotCount; index += 1) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 2.4 + 0.5
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }

    for (let index = 0; index < 10; index += 1) {
      const startX = Math.random() * width
      const startY = Math.random() * height
      context.strokeStyle = `${color}55`
      context.lineWidth = Math.random() * 1.6 + 0.3
      context.beginPath()
      context.moveTo(startX, startY)
      context.bezierCurveTo(
        startX + Math.random() * 100 - 50,
        startY + Math.random() * 50 - 25,
        startX + Math.random() * 100 - 50,
        startY + Math.random() * 50 - 25,
        startX + Math.random() * 130 - 65,
        startY + Math.random() * 90 - 45,
      )
      context.stroke()
    }
  }
}

function formatType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

async function downloadStoneInfo(stone, modalNode) {
  if (!modalNode) {
    throw new Error('Stone details are not ready to download yet.')
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(modalNode, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  })

  const fileName = `${stone.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-sample-info.pdf`
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  })

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(fileName)
}

function StoneVisual({ stone, className, canvasRef, height, alt }) {
  if (stone.image) {
    return <img src={stone.image} alt={alt} className={className} />
  }

  return <canvas ref={canvasRef} className={className} style={{ height }} />
}

export default function StoneGallery() {
  const [activeType, setActiveType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStone, setSelectedStone] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const cardCanvasRefs = useRef(new Map())
  const modalCanvasRef = useRef(null)
  const modalRef = useRef(null)

  const visibleStones = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return STONES.filter((stone) => {
      const matchesType = activeType === 'all' || stone.type === activeType

      if (!matchesType) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const searchableText = [
        stone.name,
        stone.origin,
        formatType(stone.type),
        stone.best,
        stone.desc,
        ...stone.useLabels,
      ].join(' ').toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [activeType, searchQuery])

  const shouldPaginate = activeType !== 'all' || searchQuery.trim() !== ''

  const pageCount = shouldPaginate ? Math.ceil(visibleStones.length / STONES_PER_PAGE) : 1

  const paginatedStones = useMemo(() => {
    if (!shouldPaginate) {
      return visibleStones
    }

    const startIndex = (currentPage - 1) * STONES_PER_PAGE
    return visibleStones.slice(startIndex, startIndex + STONES_PER_PAGE)
  }, [currentPage, shouldPaginate, visibleStones])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeType, searchQuery])

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(Math.max(1, pageCount))
    }
  }, [currentPage, pageCount])

  useEffect(() => {
    paginatedStones.forEach((stone) => {
      const canvas = cardCanvasRefs.current.get(stone.name)
      drawSwatch(canvas, stone, 110)
    })
  }, [paginatedStones])

  useEffect(() => {
    if (!selectedStone) {
      return undefined
    }

    drawSwatch(modalCanvasRef.current, selectedStone, 250)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedStone(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedStone])

  return (
    <section className="stone-gallery-section" id="stone-gallery">
      <div className="container">
        <div className="stone-gallery-shell">
          <div className="stone-gallery-copy">
            <p className="section-label">Material Explorer</p>
            <h2 className="section-title">Natural stone inspiration for kitchens, baths, and statement surfaces.</h2>
            <p className="stone-gallery-intro">
              Filter by material family, inspect the movement, and open any surface for a closer look at origin,
              maintenance, durability, and best-fit applications.
            </p>
          </div>

          <div className="stone-gallery-filter-label">Stone type</div>
          <div className="stone-gallery-chips" role="tablist" aria-label="Stone type filters">
            {TYPES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`stone-gallery-chip${activeType === value ? ' is-active' : ''}`}
                onClick={() => setActiveType(value)}
                aria-pressed={activeType === value}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="stone-gallery-search-row">
            <label className="stone-gallery-search-label" htmlFor="stone-gallery-search">Search samples</label>
            <input
              id="stone-gallery-search"
              type="search"
              className="stone-gallery-search-input"
              placeholder="Search by name, origin, type, or use"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="stone-gallery-divider" />

          {paginatedStones.length > 0 ? (
            <div className="stone-gallery-grid">
              {paginatedStones.map((stone) => {
              const typeColors = TYPE_COLORS[stone.type]

              return (
                <button
                  key={stone.name}
                  type="button"
                  className="stone-gallery-card"
                  onClick={() => setSelectedStone(stone)}
                >
                  <StoneVisual
                    stone={stone}
                    alt={stone.name}
                    className="stone-gallery-swatch"
                    height={110}
                    canvasRef={(node) => {
                      if (node) {
                        cardCanvasRefs.current.set(stone.name, node)
                      } else {
                        cardCanvasRefs.current.delete(stone.name)
                      }
                    }}
                  />
                  <span className="stone-gallery-card-body">
                    <span className="stone-gallery-card-name">{stone.name}</span>
                    <span className="stone-gallery-card-origin">{stone.origin}</span>
                    <span
                      className="stone-gallery-card-type"
                      style={{ backgroundColor: typeColors.pill, color: typeColors.pillFg }}
                    >
                      {formatType(stone.type)}
                    </span>
                  </span>
                </button>
              )
            })}
            </div>
          ) : (
            <div className="stone-gallery-empty">No stone samples matched that search.</div>
          )}

          {shouldPaginate && pageCount > 1 && (
            <div className="pw-pagination" aria-label="Stone gallery pagination">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`pw-page-btn${currentPage === pageNumber ? ' active' : ''}`}
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}

          <div className="stone-gallery-cta">
            <div>
              <p className="stone-gallery-cta-label">Need help choosing?</p>
              <h3>Bring your favorite surfaces into a design consultation.</h3>
            </div>
            <Link to="/schedule" className="btn btn-fill">Schedule consultation</Link>
          </div>
        </div>
      </div>

      {selectedStone && (
        <div
          className="stone-gallery-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStone(null)
            }
          }}
        >
          <div className="stone-gallery-modal" role="dialog" aria-modal="true" aria-labelledby="stone-gallery-modal-title" ref={modalRef}>
            <StoneVisual
              stone={selectedStone}
              alt={selectedStone.name}
              className="stone-gallery-modal-swatch"
              height={250}
              canvasRef={modalCanvasRef}
            />
            <div className="stone-gallery-modal-body">
              <div className="stone-gallery-modal-header">
                <div>
                  <p className="stone-gallery-modal-title" id="stone-gallery-modal-title">{selectedStone.name}</p>
                  <p className="stone-gallery-modal-origin">{selectedStone.origin}</p>
                </div>
                <div className="stone-gallery-modal-actions">
                  <button
                    type="button"
                    className="stone-gallery-modal-download"
                    onClick={async () => {
                      try {
                        setIsDownloading(true)
                        await downloadStoneInfo(selectedStone, modalRef.current)
                      } finally {
                        setIsDownloading(false)
                      }
                    }}
                    disabled={isDownloading}
                  >
                    {isDownloading ? 'Preparing PDF...' : 'Download'}
                  </button>
                  <button
                    type="button"
                    className="stone-gallery-modal-close"
                    onClick={() => setSelectedStone(null)}
                    aria-label="Close stone details"
                  >
                    x
                  </button>
                </div>
              </div>

              <span
                className="stone-gallery-modal-badge"
                style={{
                  backgroundColor: TYPE_COLORS[selectedStone.type].bg,
                  color: TYPE_COLORS[selectedStone.type].fg,
                }}
              >
                {formatType(selectedStone.type)}
              </span>

              <p className="stone-gallery-modal-desc">{selectedStone.desc}</p>

              <div className="stone-gallery-modal-grid">
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Type</p>
                  <p className="stone-gallery-info-value">{formatType(selectedStone.type)}</p>
                </div>
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Maintenance</p>
                  <p className="stone-gallery-info-value">{selectedStone.maint}</p>
                </div>
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Best for</p>
                  <p className="stone-gallery-info-value">{selectedStone.best}</p>
                </div>
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Durability</p>
                  <p className="stone-gallery-info-value">{selectedStone.dur}</p>
                </div>
              </div>

              <div className="stone-gallery-uses">
                {selectedStone.useLabels.map((label) => (
                  <span key={label} className="stone-gallery-use-chip">{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}