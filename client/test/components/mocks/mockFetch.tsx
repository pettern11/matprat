const recipe_content = [
  {
    oppskrift_id: 1,
    ingred_id: 1,
    mengde: 1,
    maleenhet: 'stk',
  },
  {
    oppskrift_id: 1,
    ingred_id: 2,
    mengde: 1,
    maleenhet: 'håndfull',
  },
  {
    oppskrift_id: 1,
    ingred_id: 3,
    mengde: 400,
    maleenhet: 'g',
  },
];

export default async function mockFetch(url) {
  if (url.startsWith('https://api.nationalize.io') && url.includes('john')) {
    return {
      ok: true,
      status: 200,
      json: async () => recipe_content,
    };
  }

  throw new Error(`Unhandled request: ${url}`);
}
