CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoice` text,
	`amount` real NOT NULL,
	`order_id` text NOT NULL,
	`customer_number` text NOT NULL,
	`status` text DEFAULT 'Pending',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`contribution_type` text NOT NULL
);
