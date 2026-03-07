import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/card-base': 'src/components/card-base.ts',
    'components/alleato-icon': 'src/components/alleato-icon.ts',
    'components/section-header': 'src/components/section-header.ts',
    'components/page-section': 'src/components/page-section.ts',
    'components/nav-bar': 'src/components/nav-bar.ts',
    'components/site-footer': 'src/components/site-footer.ts',
    'components/service-card': 'src/components/service-card.ts',
    'components/approach-card': 'src/components/approach-card.ts',
    'components/showcase-card': 'src/components/showcase-card.ts',
    'components/form-field': 'src/components/form-field.ts',
    'components/form-container': 'src/components/form-container.ts',
    'components/terminal-window': 'src/components/terminal-window.ts',
    'components/terminal-intro': 'src/components/terminal-intro.ts',
    'components/theme-picker': 'src/components/theme-picker.ts',
    'components/terminal-embed': 'src/components/terminal-embed.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
});
