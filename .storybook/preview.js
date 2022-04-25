import { TranslatitonProvider } from 'src/common/react-platform-translation'
import { store } from 'src/redux'
import { Provider } from 'react-redux'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <TranslatitonProvider>
        <Story />
      </TranslatitonProvider>
    </Provider>
  ),
];