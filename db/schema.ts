import { sql } from "drizzle-orm";
import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";


//products table
export const productstABLE = sqliteTable("products", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    category: text('category').notNull(),
    price: real('price').notNull(),
    stock: integer('stock').notNull().default(0),
    creatrd_at: integer('created_at').default(sql`CURRENT_TIMESTAMP`)
});



//SALES TABLE
export const salesTable = sqliteTable("sales", {
    id: integer('id').primaryKey({ autoIncrement: true }),
    product_id: integer('product_id').notNull().references(() => productstABLE.id),
    quantity: integer('quantity').notNull(),
    total_amount: real('total_amount').notNull(),
    sale_date: integer('sale_date').default(sql`CURRENT_TIMESTAMP`),
    customer_name: text('customer_name').notNull(),
    region: text('region').notNull(),
});