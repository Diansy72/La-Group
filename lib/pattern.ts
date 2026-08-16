// ======================
// KAWUNG
// ======================
const kawung = `
<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'>
  <defs>
    <pattern id='k' width='60' height='60' patternUnits='userSpaceOnUse'>
      <rect width='60' height='60' fill='#ffff'/>

      <ellipse cx='30' cy='15' rx='8' ry='13'
        fill='none' stroke='#c9a96e' stroke-width='1' opacity='0.35'/>

      <ellipse cx='30' cy='45' rx='8' ry='13'
        fill='none' stroke='#c9a96e' stroke-width='1' opacity='0.35'/>

      <ellipse cx='15' cy='30' rx='13' ry='8'
        fill='none' stroke='#c9a96e' stroke-width='1' opacity='0.35'/>

      <ellipse cx='45' cy='30' rx='13' ry='8'
        fill='none' stroke='#c9a96e' stroke-width='1' opacity='0.35'/>

      <circle cx='30' cy='30' r='2' fill='#c9a96e' opacity='0.4'/>
      <circle cx='0' cy='0' r='2' fill='#c9a96e' opacity='0.4'/>
      <circle cx='60' cy='0' r='2' fill='#c9a96e' opacity='0.4'/>
      <circle cx='0' cy='60' r='2' fill='#c9a96e' opacity='0.4'/>
      <circle cx='60' cy='60' r='2' fill='#c9a96e' opacity='0.4'/>
    </pattern>
  </defs>

  <rect width='60' height='60' fill='url(#k)'/>
</svg>
`;

// ======================
// PARANG
// ======================
const parang = `
<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' shape-rendering='geometricPrecision'>
  <defs>
    <pattern id='t'
      width='50'
      height='50'
      patternUnits='userSpaceOnUse'>

      <rect width='50' height='50' fill='#0f1219'/>

      <polygon points='25,4 46,25 25,46 4,25'
        fill='none' stroke='#c9a96e' stroke-width='1' opacity='0.3'/>

      <polygon points='25,11 39,25 25,39 11,25'
        fill='none' stroke='#c9a96e' stroke-width='0.6' opacity='0.2'/>

      <line x1='25' y1='4' x2='25' y2='46'
        stroke='#c9a96e' stroke-width='0.5' opacity='0.15'/>

      <line x1='4' y1='25' x2='46' y2='25'
        stroke='#c9a96e' stroke-width='0.5' opacity='0.15'/>

      <circle cx='25' cy='4' r='1.5' fill='#c9a96e' opacity='0.35'/>
      <circle cx='25' cy='46' r='1.5' fill='#c9a96e' opacity='0.35'/>
      <circle cx='4' cy='25' r='1.5' fill='#c9a96e' opacity='0.35'/>
      <circle cx='46' cy='25' r='1.5' fill='#c9a96e' opacity='0.35'/>

      <circle cx='25' cy='25' r='2'
        fill='none' stroke='#c9a96e' stroke-width='0.8' opacity='0.35'/>

    </pattern>
  </defs>

  <rect width='50' height='50' fill='url(#t)'/>
</svg>
`;

// ======================
// ENCODE
// ======================
const kawungEncoded = encodeURIComponent(kawung);
const parangEncoded = encodeURIComponent(parang);

// ======================
// EXPORT OPTIONS
// ======================
export const patternKawung = `url("data:image/svg+xml,${kawungEncoded}")`;
export const patternParang = `url("data:image/svg+xml,${parangEncoded}")`;