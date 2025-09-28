import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Teste básico para garantir que o componente App renderiza corretamente
test('renders the main application header', () => {
  render(<App />);
  const linkElement = screen.getByText(/TechBlog/i);
  expect(linkElement).toBeInTheDocument();
});