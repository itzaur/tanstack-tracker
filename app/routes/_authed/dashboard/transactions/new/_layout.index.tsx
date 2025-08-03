import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTransaction } from '@/data/createTransaction';
import { getCategories } from '@/data/getCategories';
import { format } from 'date-fns';
import { z } from 'zod';
import { toast } from 'sonner';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/new/_layout/'
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();

    return { categories };
  },
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    console.log('HANDLE SUBMIT: ', { data });

    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: format(data.transactionDate, 'yyy-MM-dd'),
      },
    });

    toast.success('Transaction created');

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });

    console.log({ transaction });
  };

  return (
    <Card className='max-w-screen-md mt-4'>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
