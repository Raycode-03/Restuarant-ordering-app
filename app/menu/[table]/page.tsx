'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionsApi, menuApi } from '@/lib/api';
import { BooksSkeleton } from '@/components/dashboard/skeleton';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import MediaDisplay from '@/components/menu/mediaDisplay';

interface PageProps {
  params: Promise<{ table: string }>;
}
type FilterType = 'all' | 'veg' | 'vegan';

export default function OrderPage({ params }: PageProps) {
  const paramsData = React.use(params);
  const tableNumber = Number(paramsData.table);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const ITEMS_PER_PAGE = 10;
  const queryClient = useQueryClient();

  // Start session
  const {
    isLoading: isSessionLoading,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    error: sessionError,
  } = useQuery({
    queryKey: ['session', tableNumber],
    queryFn: () => sessionsApi.startSession(tableNumber),
    enabled: Number.isFinite(tableNumber) && !sessionCreated,
    retry: false,
  });

  // Add to cart mutation - MOVED TO TOP LEVEL
  const { mutate: addToCart, isPending: isAddingToCart } = useMutation({
    mutationFn: (menuId: string) => menuApi.addCart(menuId),
    onSuccess: () => {
      toast.success('Added to cart', {
        description: `Menu item added to your cart.`,
      });
      // Optionally invalidate cart query to refresh cart count
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to add item to cart', {
        description: error.message,
      });
    },
  });

  // Handle cart click
  const handleCart = (menuId: string) => {
    if (isAddingToCart) return;
    addToCart(menuId);
  };

  useEffect(() => {
    if (isSessionSuccess && !sessionCreated) {
      setSessionCreated(true);
      toast.success('Session started', {
        description: `Welcome to Table ${tableNumber}`,
      });
    }
  }, [isSessionSuccess, sessionCreated, tableNumber]);

  useEffect(() => {
    if (!isSessionError || !(sessionError instanceof Error)) return;

    if (
      !navigator.onLine ||
      sessionError.message === 'NETWORK_ERROR' ||
      sessionError.message.includes('Failed to fetch')
    ) {
      toast.error('Connection issue', {
        description: 'Poor internet connection. Please check your network.',
        duration: 1000,
      });
      return;
    }

    toast.error('Failed to create session', {
      description: sessionError.message,
    });
  }, [isSessionError, sessionError]);

  // Menu query
  const {
    data: menus = [],
    isLoading: isMenuLoading,
    error: menuError,
  } = useQuery({
    queryKey: ['menus', page],
    queryFn: () => menuApi.getMenus(page, ITEMS_PER_PAGE),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (menuError instanceof Error) {
      toast.error('Failed to load menus', {
        description: menuError.message,
      });
    }
  }, [menuError]);

  const prevPage = () => setPage((old) => Math.max(old - 1, 0));
  const nextPage = () => setPage((old) => old + 1);

  const filteredMenus = menus.filter((menu) => {
    if (!menu.is_available) return false;

    // Filter logic
    if (filter === 'veg' && !menu.is_veg) return false;
    if (filter === 'vegan' && !menu.is_vegan) return false;

    // Search filter
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      return (
        menu.name?.toLowerCase().includes(query) ||
        menu.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Session loader */}
      {isSessionLoading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Setting up your table...</p>
            <p className="text-sm text-gray-500 mt-2">Table {tableNumber}</p>
          </div>
        </div>
      )}

      {/* Menu loader */}
      {isMenuLoading && !isSessionLoading && <BooksSkeleton />}

      {/* Menu error */}
      {menuError && (
        <div className="text-red-500 text-center mt-6">Failed to load menus</div>
      )}

      <div className="flex items-center justify-between w-full mb-4 gap-4 flex-wrap">
        {/* LEFT: Filters */}
        <div className="flex gap-3 flex-wrap">
          {(['all', 'veg', 'vegan'] as FilterType[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* RIGHT: Search */}
        <div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 p-2 border rounded-md"
            placeholder="Search menu items..."
          />
        </div>
      </div>

      {/* Menu grid */}
      {!isMenuLoading && !menuError && (
        <>
          <div className="w-full max-w-7xl mx-auto grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMenus.map((menu) => (
              <div
                key={menu._id}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
              >
                <MediaDisplay
                  video_url={menu.video_url}
                  image_url={menu.image_url}
                  alt={menu.name}
                />

                <CardContent className="p-4 space-y-2">
                  <h3 className="text-base font-semibold line-clamp-1">{menu.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {menu.description}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    ₦{menu.price.toLocaleString()}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-10 cursor-pointer"
                    onClick={() => handleCart(menu._id)}
                    disabled={isAddingToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button size="sm" onClick={prevPage} disabled={page === 0}>
              Prev
            </Button>
            <span>Page {page + 1}</span>
            <Button
              size="sm"
              onClick={nextPage}
              disabled={menus.length < ITEMS_PER_PAGE}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}