// app/order/[table]/layout.tsx
import SessionProvider from './SessionProvider';
import { Providers } from "@/provider";
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ table: string }>;
}

export default async function OrderLayout({ children, params }: LayoutProps) {
  const { table } = await params;
  const tableNumber = Number(table);

  if (isNaN(tableNumber)) {
    throw new Error('Invalid table number');
  }

  return (

    <Providers>
      <SessionProvider tableNumber={tableNumber}>
        {children}
      </SessionProvider>
    </Providers>

  );
}