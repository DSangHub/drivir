CREATE TABLE `drivers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`display_name` text,
	`total_points` integer DEFAULT 0 NOT NULL,
	`safe_streak` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `driving_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trip_id` integer NOT NULL,
	`event_type` text NOT NULL,
	`safe` integer NOT NULL,
	`recorded_at` integer NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` text NOT NULL,
	`destination_label` text NOT NULL,
	`target_minutes` integer NOT NULL,
	`safe_score` integer,
	`points_earned` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action
);
