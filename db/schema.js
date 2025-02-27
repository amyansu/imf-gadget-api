import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const status = pgEnum('status', ["Available", "Deployed", "Destroyed", "Decommissioned"]);

export const gadgetsTable = pgTable("gadgets", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    status: status("status").notNull().default("Available"),
    decommissioned_at: timestamp("decommissioned_at"),
    userId: uuid("userId").notNull().references(() => usersTable.id, { onDelete: "cascade" }), // Foreign key
})

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),// Generates a unique ID
    username: text("username").unique().notNull(),
    password: text("password").notNull(),
})