export { CardBase } from './components/card-base';
export { AlleatoIcon, register as registerIcon } from './components/alleato-icon';
export { SectionHeader, register as registerSectionHeader } from './components/section-header';
export { PageSection, register as registerPageSection } from './components/page-section';
export { NavBar, register as registerNavBar } from './components/nav-bar';
export { SiteFooter, register as registerSiteFooter } from './components/site-footer';
export { ServiceCard, register as registerServiceCard } from './components/service-card';
export { ApproachCard, register as registerApproachCard } from './components/approach-card';
export { ShowcaseCard, register as registerShowcaseCard } from './components/showcase-card';
export { FormField, register as registerFormField } from './components/form-field';
export { FormContainer, register as registerFormContainer } from './components/form-container';

export function registerAll() {
  import('./components/alleato-icon').then(({ register }) => register());
  import('./components/section-header').then(({ register }) => register());
  import('./components/page-section').then(({ register }) => register());
  import('./components/nav-bar').then(({ register }) => register());
  import('./components/site-footer').then(({ register }) => register());
  import('./components/service-card').then(({ register }) => register());
  import('./components/approach-card').then(({ register }) => register());
  import('./components/showcase-card').then(({ register }) => register());
  import('./components/form-field').then(({ register }) => register());
  import('./components/form-container').then(({ register }) => register());
}
