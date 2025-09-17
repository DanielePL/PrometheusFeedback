import { render, screen } from '@testing-library/react';
import App from './App';

test('renders feedback application', () => {
  render(<App />);
  const linkElement = screen.getByText(/Beta Feedback Programm/i);
  expect(linkElement).toBeInTheDocument();
});
