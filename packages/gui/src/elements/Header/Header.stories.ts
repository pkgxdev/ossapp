import Header from './Header.svelte';

export default {
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/svelte/writing-docs/docs-page
  tags: ['docsPage'],
  render: (args) => ({
    Component: Header,
    props: args,
    on: {
      login: args.onLogin,
      logout: args.onLogout,
      createAccount: args.onCreateAccount,
    },
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/svelte/configure/story-layout
    layout: 'fullscreen',
  },
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut = {};
