// Material grade mappings
export const materialGradeMappings: Record<string, string[]> = {
  // ASTM (USA)
  A36: ['CS Type B', 'Commercial Steel'],
  A572: ['HSLA', 'High Strength Low Alloy'],
  'AISI 1018': ['CS Type B', 'Commercial Steel'],

  // EN (Europe)
  S355: ['HSLA', 'High Strength Low Alloy'],
  DC01: ['DD11', 'Cold Rolled'],

  // JIS (Japan)
  SPCC: ['DD11', 'Cold Rolled'],
  SS400: ['CS Type B', 'Commercial Steel'],

  // Factory specific
  AJ98: ['CS Type B', 'Commercial Steel'],
  AJ03: ['DD11', 'Cold Rolled'],

  // Functional names
  IF: ['IF', 'Interstitial Free'],
  CS: ['CS Type B', 'Commercial Steel'],
  HSLA: ['HSLA', 'High Strength Low Alloy'],
  HR: ['HR', 'Hot Rolled'],
  CR: ['DD11', 'Cold Rolled'],
  EG: ['EG', 'Electro-Galvanized'],
  GI: ['GI', 'Hot Dipped Galvanized'],

  // Additional mappings
  'Commercial Steel': ['CS Type B', 'Commercial Steel'],
  'Interstitial Free': ['IF', 'Interstitial Free'],
  'High Strength Low Alloy': ['HSLA', 'High Strength Low Alloy'],
  'Cold Rolled': ['DD11', 'Cold Rolled'],
  'Hot Rolled': ['HR', 'Hot Rolled'],
  'Electro-Galvanized': ['EG', 'Electro-Galvanized'],
  'Hot Dipped Galvanized': ['GI', 'Hot Dipped Galvanized']
};

// Material name mappings
export const materialNameMappings: Record<string, string[]> = {
  'Commercial Steel': ['CS', 'Commercial Steel', 'CS Type B'],
  'Interstitial Free': ['IF', 'Interstitial Free'],
  'High Strength Low Alloy': ['HSLA', 'High Strength Low Alloy'],
  'Cold Rolled': ['CR', 'Cold Rolled', 'DD11'],
  'Hot Rolled': ['HR', 'Hot Rolled'],
  'Electro-Galvanized': ['EG', 'Electro-Galvanized'],
  'Hot Dipped Galvanized': ['GI', 'Hot Dipped Galvanized', 'Galvanized']
};

// Function to check if a string matches any of the mapped values
export function findMatchingMaterial(input: string, mappings: Record<string, string[]>): string[] {
  const normalizedInput = input.toLowerCase().trim();
  const matches: string[] = [];

  for (const [key, values] of Object.entries(mappings)) {
    if (
      values.some((value) => value.toLowerCase().includes(normalizedInput)) ||
      normalizedInput.includes(key.toLowerCase())
    ) {
      matches.push(key);
    }
  }

  return matches;
}

// Function to check if a material matches any of our known materials
export function isMatchingMaterial(name: string, grade: string): boolean {
  const matchingNames = findMatchingMaterial(name, materialNameMappings);
  const matchingGrades = findMatchingMaterial(grade, materialGradeMappings);

  return matchingNames.length > 0 || matchingGrades.length > 0;
}
