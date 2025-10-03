import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from ../src/js/http-client.js';
import { retry } from '../packages/rxjs/esm/internal/operators/retry.js';
import { timeout } from '../packages/rxjs/esm/internal/operators/timeout.js';
import { catchError } from '../packages/rxjs/esm/internal/operators/catchError.js';
import { map } from '../packages/rxjs/esm/internal/operators/map.js';
import { of } from '../packages/rxjs/esm/internal/observable/of.js';

/**
 * Advanced examples demonstrating all Angular HttpClient features
 */

// Create HTTP client instance
const httpClient = new HttpClient({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  defaultHeaders: new HttpHeaders({
    'X-App-Version': '1.0.0',
  }),
});

// Define a context token for caching
const CACHE_ENABLED = new HttpContextToken(false);

// Add request interceptor with context support
httpClient.addRequestInterceptor((url, options, context) => {
  console.log('🔵 Request Interceptor:', url);

  // Check context for cache flag
  if (context.get(CACHE_ENABLED)) {
    console.log('💾 Caching enabled for this request');
  }

  // Add timestamp to all requests
  options.headers['X-Request-Time'] = new Date().toISOString();

  return { url, options };
});

// Add response interceptor
httpClient.addResponseInterceptor((response, context) => {
  console.log('🟢 Response Interceptor:', response.status);
  return response;
});

// Example 1: Using HttpParams for query strings
console.log('=== Example 1: HttpParams ===');
const params = new HttpParams()
  .set('userId', '1')
  .append('_limit', '5')
  .append('_sort', 'id')
  .append('_order', 'desc');

httpClient.get('/posts', { params }).subscribe({
  next: (posts) => {
    console.log('✅ Posts with params:', posts.length, 'items');
    document.getElementById('output').innerHTML += `
      <h3>Example 1: HttpParams</h3>
      <p>Query: ${params.toString()}</p>
      <pre>${JSON.stringify(posts, null, 2)}</pre>
    `;
  },
  error: (error) => console.error('❌ Error:', error),
});

// Example 2: Using HttpHeaders
console.log('=== Example 2: HttpHeaders ===');
const customHeaders = new HttpHeaders()
  .set('Accept', 'application/json')
  .append('X-Custom-1', 'value1')
  .append('X-Custom-2', 'value2');

httpClient
  .get('/posts/1', {
    headers: customHeaders,
    observe: 'response', // Get full response
  })
  .subscribe({
    next: (response) => {
      console.log('✅ Full response:', response);
      document.getElementById('output').innerHTML += `
      <h3>Example 2: HttpHeaders & Full Response</h3>
      <p>Status: ${response.status}</p>
      <p>Headers sent: ${customHeaders.keys().join(', ')}</p>
      <pre>${JSON.stringify(response.body, null, 2)}</pre>
    `;
    },
    error: (error) => console.error('❌ Error:', error),
  });

// Example 3: Progress events with file upload simulation
console.log('=== Example 3: Progress Events ===');
const largeData = { title: 'Large post', body: 'x'.repeat(1000), userId: 1 };

httpClient
  .post('/posts', largeData, {
    reportProgress: true,
    observe: 'events',
  })
  .subscribe({
    next: (event) => {
      if (event.type === HttpEventType.Sent) {
        console.log('📤 Request sent');
      } else if (event.type === HttpEventType.UploadProgress) {
        console.log(`⬆️ Upload: ${event.progress}%`);
      } else if (event.type === HttpEventType.DownloadProgress) {
        console.log(`⬇️ Download: ${event.progress}%`);
      } else if (event.type === HttpEventType.Response) {
        console.log('✅ Response received:', event.body);
        document.getElementById('output').innerHTML += `
        <h3>Example 3: Progress Events</h3>
        <p>Request completed with progress tracking</p>
        <pre>${JSON.stringify(event.body, null, 2)}</pre>
      `;
      }
    },
    error: (error) => console.error('❌ Error:', error),
  });

// Example 4: HttpContext for metadata
console.log('=== Example 4: HttpContext ===');
const context = new HttpContext().set(CACHE_ENABLED, true);

httpClient
  .get('/posts/2', {
    context,
  })
  .subscribe({
    next: (post) => {
      console.log('✅ Post with context:', post);
      document.getElementById('output').innerHTML += `
      <h3>Example 4: HttpContext</h3>
      <p>Request with caching context enabled</p>
      <pre>${JSON.stringify(post, null, 2)}</pre>
    `;
    },
    error: (error) => console.error('❌ Error:', error),
  });

// Example 5: Retry with exponential backoff
console.log('=== Example 5: Retry Logic ===');
httpClient
  .get('/posts/invalid-url')
  .pipe(
    retry(3), // Retry up to 3 times
    catchError((error) => {
      console.log('❌ Failed after retries:', error.status);
      return of({ error: 'Failed after 3 retries', status: error.status });
    })
  )
  .subscribe({
    next: (data) => {
      console.log('✅ Final result:', data);
      document.getElementById('output').innerHTML += `
      <h3>Example 5: Retry Logic</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    },
  });

// Example 6: Timeout handling
console.log('=== Example 6: Timeout ===');
httpClient
  .get('/posts/3')
  .pipe(
    timeout(5000), // 5 second timeout
    catchError((error) => {
      console.log('❌ Request timeout');
      return of({ error: 'Request timeout', message: error.message });
    })
  )
  .subscribe({
    next: (data) => {
      console.log('✅ Success:', data);
      document.getElementById('output').innerHTML += `
      <h3>Example 6: Timeout</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    },
  });

// Example 7: Transform response data
console.log('=== Example 7: Transform Response ===');
httpClient
  .get('/posts', {
    params: new HttpParams().set('_limit', '3'),
  })
  .pipe(
    map((posts) => {
      // Transform: extract only titles
      return posts.map((post) => ({
        id: post.id,
        title: post.title.toUpperCase(),
      }));
    })
  )
  .subscribe({
    next: (transformed) => {
      console.log('✅ Transformed:', transformed);
      document.getElementById('output').innerHTML += `
      <h3>Example 7: Transform Response</h3>
      <pre>${JSON.stringify(transformed, null, 2)}</pre>
    `;
    },
  });

// Example 8: Different response types
console.log('=== Example 8: Response Types ===');

// Text response
httpClient
  .get('/posts/1', {
    responseType: 'text',
  })
  .subscribe({
    next: (text) => {
      console.log('✅ Text response:', typeof text);
      document.getElementById('output').innerHTML += `
      <h3>Example 8: Text Response Type</h3>
      <p>Type: ${typeof text}</p>
      <pre>${text.substring(0, 200)}...</pre>
    `;
    },
  });

// Example 9: HEAD request to check resource
console.log('=== Example 9: HEAD Request ===');
httpClient
  .head('/posts/1', {
    observe: 'response',
  })
  .subscribe({
    next: (response) => {
      console.log('✅ HEAD response:', response.status);
      const headers = Array.from(response.headers.entries());
      document.getElementById('output').innerHTML += `
      <h3>Example 9: HEAD Request</h3>
      <p>Status: ${response.status}</p>
      <p>Content-Type: ${response.headers.get('content-type')}</p>
      <pre>Headers: ${headers.length} total</pre>
    `;
    },
  });

// Example 10: OPTIONS request
console.log('=== Example 10: OPTIONS Request ===');
httpClient.options('/posts', { observe: 'response' }).subscribe({
  next: (response) => {
    console.log('✅ OPTIONS response:', response.status);
    document.getElementById('output').innerHTML += `
      <h3>Example 10: OPTIONS Request</h3>
      <p>Status: ${response.status}</p>
      <p>Allowed methods available</p>
    `;
  },
  error: (error) => {
    console.log('Note: OPTIONS may not be supported by JSONPlaceholder');
  },
});

// Example 11: Chaining requests
console.log('=== Example 11: Chaining Requests ===');
httpClient
  .get('/users/1')
  .pipe(
    map((user) => user.id)
    // Get posts for that user
    // Note: This would normally use switchMap, but keeping it simple
  )
  .subscribe({
    next: (userId) => {
      httpClient
        .get('/posts', {
          params: new HttpParams().set('userId', userId.toString()),
        })
        .subscribe({
          next: (posts) => {
            console.log('✅ User posts:', posts.length);
            document.getElementById('output').innerHTML += `
            <h3>Example 11: Chained Requests</h3>
            <p>Found ${posts.length} posts for user ${userId}</p>
          `;
          },
        });
    },
  });

// Example 12: withCredentials for CORS
console.log('=== Example 12: With Credentials ===');
httpClient
  .get('/posts/1', {
    withCredentials: true, // Send cookies with request
  })
  .subscribe({
    next: (post) => {
      console.log('✅ Request with credentials:', post.id);
      document.getElementById('output').innerHTML += `
      <h3>Example 12: With Credentials</h3>
      <p>Request sent with credentials flag</p>
    `;
    },
    error: (error) => console.error('❌ Error:', error),
  });

console.log('🚀 All examples initiated!');
