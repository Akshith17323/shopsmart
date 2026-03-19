import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import App from './App';

// Setup Mock Service Worker for integration testing
const server = setupServer(
  http.get('http://localhost:5001/api/products', () => {
    return HttpResponse.json([
      { id: 999, name: 'Integration Test Headset', description: 'Test equipment', price: 99.99, image: 'mock.jpg' }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Application Root & Integration', () => {
    it('should render the main application title and initial state', async () => {
        render(<App />);
        const linkElement = await screen.findByText(/ShopSmart/i);
        expect(linkElement).toBeInTheDocument();

        // Check if the cart button is universally displayed
        expect(screen.getByRole('button', { name: /Cart/i })).toBeInTheDocument();
    });

    it('successfully fetches API data and triggers integration with the Cart module', async () => {
        render(<App />);
        
        // Wait for API Mock integration to resolve and render the product
        const productTitle = await screen.findByText(/Integration Test Headset/i);
        expect(productTitle).toBeInTheDocument();
        
        // Test real user interaction between Product module and Cart module
        const user = userEvent.setup();
        const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
        await user.click(addToCartBtn);
        
        // Verify the cart dynamically updated
        const cartHeader = await screen.findByText(/Your Cart \(1\)/i);
        expect(cartHeader).toBeInTheDocument();     
    });
});
