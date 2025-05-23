import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
`;

export default GlobalStyle;
