import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteTransaction } from '@/data/deleteTransaction';
import { getCategories } from '@/data/getCategories';
import { getTransaction } from '@/data/getTransaction';
import { updateTransaction } from '@/data/updateTransaction';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
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
  const [deleting, setDeleting] = useState(false);
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

    toast.success('Transaction updated');

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);

    await deleteTransaction({
      data: {
        transactionId: transaction.id,
      },
    });

    toast.success('Transaction deleted');

    setDeleting(false);

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: +transaction.transactionDate.split('-')[1],
        year: +transaction.transactionDate.split('-')[0],
      },
    });
  };

  return (
    <Card className='max-w-screen-md mt-4'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='icon'>
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This transaction will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  variant='destructive'
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
