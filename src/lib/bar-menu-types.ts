export const COMING_SOON_TITLE = 'Our New Bar Menu Is Coming Soon!';
export const COMING_SOON_TEXT =
  'We’re working on something worth raising a glass to. Check back soon for our updated cocktail, wine, and beer selections.';

export type BarMenu =
  | { readonly state: 'pdf'; readonly pdfUrl: string }
  | { readonly state: 'soon'; readonly title: string; readonly text: string };
