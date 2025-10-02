import { HttpClient } from '../src/http-client.js';

/**
 * Example usage of HttpClient
 */

// Create HTTP client instance
const httpClient = new HttpClient({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  defaultHeaders: {
    'X-Custom-Header': 'MyApp',
  },
});

// Add request interceptor (e.g., for adding auth token)
httpClient.addRequestInterceptor((url, options) => {
  console.log('Request interceptor:', url);
  // Example: Add auth token
  // options.headers['Authorization'] = 'Bearer YOUR_TOKEN';
  return { url, options };
});

// Add response interceptor (e.g., for logging or transforming data)
httpClient.addResponseInterceptor((response) => {
  console.log('Response interceptor:', response.status);
  return response;
});

// Example 1: GET request
console.log('Example 1: GET request');
httpClient.get('/posts/1').subscribe({
  next: (response) => {
    console.log('GET Success:', response.body);
    document.getElementById('output').innerHTML += `
      <h3>GET /posts/1</h3>
      <pre>${JSON.stringify(response.body, null, 2)}</pre>
    `;
  },
  error: (error) => {
    console.error('GET Error:', error);
  },
  complete: () => {
    console.log('GET Complete');
  },
});

// Example 2: POST request
console.log('Example 2: POST request');
httpClient
  .post('/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  })
  .subscribe({
    next: (response) => {
      console.log('POST Success:', response.body);
      document.getElementById('output').innerHTML += `
      <h3>POST /posts</h3>
      <pre>${JSON.stringify(response.body, null, 2)}</pre>
    `;
    },
    error: (error) => {
      console.error('POST Error:', error);
    },
  });

// Example 3: GET multiple posts
console.log('Example 3: GET multiple posts');
httpClient.get('/posts', { responseType: 'json' }).subscribe({
  next: (response) => {
    const posts = response.body.slice(0, 5); // First 5 posts
    console.log('GET Multiple Success:', posts.length, 'posts');
    document.getElementById('output').innerHTML += `
      <h3>GET /posts (first 5)</h3>
      <pre>${JSON.stringify(posts, null, 2)}</pre>
    `;
  },
  error: (error) => {
    console.error('GET Multiple Error:', error);
  },
});

// Example 4: PUT request
console.log('Example 4: PUT request');
httpClient
  .put('/posts/1', {
    id: 1,
    title: 'updated title',
    body: 'updated body',
    userId: 1,
  })
  .subscribe({
    next: (response) => {
      console.log('PUT Success:', response.body);
      document.getElementById('output').innerHTML += `
      <h3>PUT /posts/1</h3>
      <pre>${JSON.stringify(response.body, null, 2)}</pre>
    `;
    },
    error: (error) => {
      console.error('PUT Error:', error);
    },
  });

// Example 5: DELETE request
console.log('Example 5: DELETE request');
httpClient.delete('/posts/1').subscribe({
  next: (response) => {
    console.log('DELETE Success:', response.body);
    document.getElementById('output').innerHTML += `
      <h3>DELETE /posts/1</h3>
      <pre>Status: ${response.status} - ${response.statusText}</pre>
    `;
  },
  error: (error) => {
    console.error('DELETE Error:', error);
  },
});

// Example 6: Error handling
console.log('Example 6: Error handling');
httpClient.get('/posts/999999').subscribe({
  next: (response) => {
    console.log('Success:', response.body);
  },
  error: (error) => {
    console.error('Error:', error.status, error.statusText);
    document.getElementById('output').innerHTML += `
      <h3>Error Example - GET /posts/999999</h3>
      <pre>Status: ${error.status} - ${error.statusText}</pre>
    `;
  },
});

// Example 7: Custom headers
console.log('Example 7: Custom headers');
httpClient
  .get('/posts/1', {
    headers: {
      'X-Request-ID': 'custom-request-123',
    },
  })
  .subscribe({
    next: (response) => {
      console.log('Custom Headers Success:', response.body);
    },
    error: (error) => {
      console.error('Custom Headers Error:', error);
    },
  });
