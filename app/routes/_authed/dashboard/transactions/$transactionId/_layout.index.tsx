import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories } from '@/data/getCategories';
import { getTransaction } from '@/data/getTransaction';
import { updateTransaction } from '@/data/updateTransaction';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/$transactionId/_layout/'
)({
  component: RouteComponent,
  errorComponent: () => (
    <div className='text-3xl text-muted-foreground my-4'>
      Oops! Transaction not found.
    </div>
  ),
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: {
          transactionId: +params.transactionId,
        },
      }),
    ]);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return { categories, transaction };
  },
});

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
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
  };

  return (
    <Card className='max-w-screen-md mt-4'>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          defaultValues={{
            description: transaction.description,
            transactionType:
              categories.find(
                (category) => category.id === transaction.categoryId
              )?.type ?? 'income',
            categoryId: transaction.categoryId,
            transactionDate: new Date(transaction.transactionDate),
            amount: +transaction.amount,
          }}
          categories={categories}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
