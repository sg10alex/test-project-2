/**
 * Basic setup test to verify Jest configuration
 */

describe('Project Setup', () => {
  it('should have Jest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should support TypeScript', () => {
    const greeting: string = 'Hello, TypeScript!';
    expect(typeof greeting).toBe('string');
  });

  it('should support async/await', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });
});
