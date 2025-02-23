import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const status = pgEnum('status', ["Available", "Deployed", "Destroyed", "Decommissioned"]);

export const gadgetsTable = pgTable("gadgets", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    status: status().notNull().default("Available"),
    decommissioned_at: timestamp(),
})

export const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    username: text().unique().notNull(),
    password: text().notNull(),
})