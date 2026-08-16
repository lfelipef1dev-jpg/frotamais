CREATE TABLE `geofences` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`center_lat` real NOT NULL,
	`center_lng` real NOT NULL,
	`radius` integer NOT NULL,
	`color` text DEFAULT '#FF6B35' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inspections` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`driver_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`defects` text,
	`notes` text,
	`odometer` integer,
	`performed_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'admin' NOT NULL;