import 'styled-components';

import { Theme } from './styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// declare module '@styled-system/should-forward-prop' {
//   const shouldForwardProp: (prop: string) => boolean;
//   export default shouldForwardProp;
// }

declare module '@styled-system/should-forward-prop' {
  export const props: string[];
}