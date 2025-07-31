import { createFileRoute } from '@tanstack/react-router';
import { RecentTransaction } from './-recent-transaction';
import { getRecentTransactions } from '@/data/getRecentTransactions';
import { getAnnualCashflow } from '@/data/getAnnualCashflow';
import { getTransactionYearRange } from '@/data/getTransactionYearRange';
import { Cashflow } from './-cashflow';
import { z } from 'zod';
import LoadingSkeleton from '@/components/loading-skeleton';

const today = new Date();
const CENTURY = 100;

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - CENTURY)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute('/_authed/dashboard/')({
  pendingComponent: () => (
    <div className='max-w-screen-xl mx-auto py-5'>
      <h1 className='text-4xl font-semibold pb-5'>Dashboard</h1>
      <LoadingSkeleton />
    </div>
  ),
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => ({
    cfyear: search.cfyear ?? today.getFullYear(),
  }),
  loader: async ({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: {
          year: deps.cfyear,
        },
      }),
      getTransactionYearRange(),
    ]);

    return { transactions, cashflow, yearsRange, cfyear: deps.cfyear };
  },
});

function RouteComponent() {
  const { transactions, cashflow, yearsRange, cfyear } = Route.useLoaderData();

  console.log({ cashflow });

  return (
    <div className='max-w-screen-xl mx-auto py-5'>
      <h1 className='text-4xl font-semibold pb-5'>Dashboard</h1>
      <Cashflow
        year={cfyear}
        yearsRange={yearsRange}
        annualCashflow={cashflow}
      />
      <RecentTransaction transactions={transactions} />
    </div>
  );
}
