import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LiveSearch from '@/components/LiveSearch';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// mock the hook so we can control what results are returned without hitting
// supabase. the component uses a debounced query so we also disable the
// debounce delay in tests by setting it to a small value.

type Product = {
  id: string;
  name: string;
  images: string[];
  price: number;
};

vi.mock('@/hooks/useProducts', () => {
  return {
    useProductSearch: (query?: string) => {
      const results: Product[] = [];
      if (query && query.toLowerCase().includes('a')) {
        results.push({ id: '1', name: 'Apple', images: ['foo.jpg'], price: 10 });
      }
      return { data: results, isFetching: false };
    },
  };
});

// the debounce hook uses setTimeout; we can speed it up by passing a
// delay of 0 when calling it in tests. an alternative is to mock it, but the
// simplest approach is to override the implementation here.
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: <T>(value: T) => value,
}));

describe('LiveSearch component', () => {
  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LiveSearch />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('displays suggestions as the user types', async () => {
    renderComponent();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a' } });

    expect(await screen.findByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('shows "no products found" when there are no matching items', async () => {
    renderComponent();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'z' } });

    expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
  });
});
