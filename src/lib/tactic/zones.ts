// Named zones mapped to SVG pixel coordinates.
// Coordinate space: 800×518 (proportional to FIFA 105m×68m).
// x=0: own goal line  x=800: opponent goal line
// y=0: top touchline  y=518: bottom touchline
// "left" side = top of SVG (y near 0)

export const ZONES: Record<string, [number, number]> = {
  // Own half — goalkeeper and back line
  gk:              [ 38, 259],
  lb:              [160,  59],
  'cb-l':          [176, 195],
  'cb-c':          [176, 259],
  'cb-r':          [176, 323],
  rb:              [160, 459],
  'wb-l':          [240,  39],
  'wb-r':          [240, 479],
  // Midfield
  dm:              [290, 259],
  'cm-l':          [352, 155],
  cm:              [352, 259],
  'cm-r':          [352, 363],
  lm:              [352,  78],
  rm:              [352, 440],
  am:              [465, 259],
  // Attack
  lw:              [545,  59],
  rw:              [545, 459],
  cf:              [608, 259],
  ss:              [528, 176],
  'ss-r':          [528, 343],
  'if-l':          [520, 140],
  'if-r':          [520, 378],

  // Opponent — mirrored positions
  'opp-gk':        [762, 259],
  'opp-lb':        [640, 459],
  'opp-cb-l':      [624, 195],
  'opp-cb-c':      [624, 259],
  'opp-cb-r':      [624, 323],
  'opp-rb':        [640,  59],
  'opp-wb-l':      [560, 479],
  'opp-wb-r':      [560,  39],
  'opp-dm':        [512, 259],
  'opp-cm-l':      [448, 155],
  'opp-cm':        [448, 259],
  'opp-cm-r':      [448, 363],

  // Semantic target zones
  'left-channel':         [600,  32],
  'right-channel':        [600, 486],
  'left-half-space':      [544, 155],
  'right-half-space':     [544, 363],
  'left-high':            [640,  78],
  'right-high':           [640, 440],
  pivot:                  [352, 259],
  'near-post':            [736,  38],
  'back-post':            [736, 480],
  'penalty-spot':         [716, 259],
  'top-of-box':           [672, 259],
  'edge-l':               [672, 176],
  'edge-r':               [672, 343],
  'six-yard-l':           [760, 221],
  'six-yard-r':           [760, 297],
  'own-left-channel':     [200,  32],
  'own-right-channel':    [200, 486],
  'own-left-half-space':  [256, 155],
  'own-right-half-space': [256, 363],
};
