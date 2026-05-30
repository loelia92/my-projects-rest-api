ALTER TABLE `projects` ADD `user_id` integer REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `idx_projects_user_id` ON `projects` (`user_id`);