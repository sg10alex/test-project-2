/**
 * Basic setup test to verify Jest and React Testing Library configuration
 */

import { render, screen } from '@testing-library/react';

describe('Project Setup', () => {
  it('should have Jest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should support TypeScript', () => {
    const greeting: string = 'Hello, TypeScript!';
    expect(typeof greeting).toBe('string');
  });

  it('should render a simple component', () => {
    const TestComponent = () => <div>Test Component</div>;
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
