import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main application header', () => {
  render(<App />);
  const linkElements = screen.getAllByText(/TechBlog/i);
  expect(linkElements.length).toBeGreaterThan(0);
  expect(linkElements[0]).toBeInTheDocument();
});