CREATE TABLE "test_branch_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"branch_name" text DEFAULT 'test-schema-change-2' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
