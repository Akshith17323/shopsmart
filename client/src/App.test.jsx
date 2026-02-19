import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('Application Root', () => {
    it('should render the main application title and initial state', async () => {
        render(<App />);
        const linkElement = await screen.findByText(/ShopSmart/i);
        expect(linkElement).toBeInTheDocument();

        // Check if mock data is displayed
        expect(await screen.findByText(/Mocked Backend is healthy/i)).toBeInTheDocument();
    });
});
