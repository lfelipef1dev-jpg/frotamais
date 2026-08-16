CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` text,
	`refresh_token_expires_at` text,
	`scope` text,
	`password` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`type` text NOT NULL,
	`severity` text NOT NULL,
	`details` text NOT NULL,
	`triggered_at` text NOT NULL,
	`resolved_at` text
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`license_number` text NOT NULL,
	`license_expiry` text NOT NULL,
	`phone` text NOT NULL,
	`status` text NOT NULL,
	`current_vehicle_id` text,
	`safety_score` integer DEFAULT 100 NOT NULL,
	`total_trips` integer DEFAULT 0 NOT NULL,
	`total_km` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_license_number_unique` ON `drivers` (`license_number`);--> statement-breakpoint
CREATE TABLE `fuel_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` text NOT NULL,
	`odometer` integer NOT NULL,
	`liters` real NOT NULL,
	`cost` real NOT NULL,
	`station` text
);
--> statement-breakpoint
CREATE TABLE `maintenance` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`cost` real,
	`performed_at` text NOT NULL,
	`performed_by` text,
	`next_due_km` integer,
	`next_due_date` text
);
--> statement-breakpoint
CREATE TABLE `safety_events` (
	`id` text PRIMARY KEY NOT NULL,
	`driver_id` text NOT NULL,
	`vehicle_id` text,
	`type` text NOT NULL,
	`severity` text NOT NULL,
	`speed` real,
	`speed_limit` real,
	`lat` real,
	`lng` real,
	`occurred_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` text NOT NULL,
	`token` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`driver_id` text NOT NULL,
	`status` text NOT NULL,
	`start_address` text,
	`start_lat` real,
	`start_lng` real,
	`end_address` text,
	`end_lat` real,
	`end_lng` real,
	`started_at` text,
	`completed_at` text,
	`distance_km` real,
	`duration_minutes` integer,
	`fuel_used_liters` real
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`plate` text NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`fuel_type` text NOT NULL,
	`current_odometer` integer DEFAULT 0 NOT NULL,
	`fuel_level` integer DEFAULT 100 NOT NULL,
	`current_lat` real,
	`current_lng` real,
	`assigned_driver_id` text,
	`last_location_update` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_plate_unique` ON `vehicles` (`plate`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
