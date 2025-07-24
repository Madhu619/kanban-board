export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export function mockApi<T>(
  response: T,
  delay = 1000,
  shouldError = false
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldError) {
        resolve({ error: "Simulated API error" });
      } else {
        resolve({ data: response });
      }
    }, delay);
  });
}

// Example usage:
// mockApi({ foo: 'bar' }, 1500, true).then(res => ...)
