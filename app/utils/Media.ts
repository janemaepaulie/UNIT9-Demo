export const breakpoints = {
  mobile: 568,
  tablet: 768,
  tabletLand: 992,
  desktop: 1920,
};

const query = (width: number) => `@media only screen and (max-width: ${width}px)`;

export const media = {
  custom: query,
  tablet: query(breakpoints.tablet),
  tabletLand: query(breakpoints.tabletLand),
  desktop: query(breakpoints.desktop),
};
