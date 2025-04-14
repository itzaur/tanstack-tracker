import { createServerFn } from '@tanstack/start';
import authMiddleware from '@/authMiddleware';
import { z } from 'zod';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const schema = z.object({
  transactionId: z.number(),
});

export const getTransaction = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, data.transactionId),
          eq(transactionsTable.userId, context.userId)
        )
      );

    return transaction;
  });
