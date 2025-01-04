CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoice` text,
	`name` text NOT NULL,
	`number` text NOT NULL,
	`amount` real NOT NULL,
	`order_id` text DEFAULT 'jz0wFZaETBSqZrOxoa10G' NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`contribution_type` text NOT NULL
);
