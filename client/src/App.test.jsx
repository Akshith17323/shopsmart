import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('Application Root', () => {
    it('should render the main application title and initial state', async () => {
        render(<App />);
        const linkElement = await screen.findByText(/ShopSmart/i);
        expect(linkElement).toBeInTheDocument();

        // Check if loading state or cart is displayed
        expect(await screen.findByText(/Loading amazing products/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cart/i })).toBeInTheDocument();
    });
});
