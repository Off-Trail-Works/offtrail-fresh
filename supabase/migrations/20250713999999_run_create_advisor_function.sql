-- Final migration: Run advisor creation after all seeding is complete
-- This runs AFTER all previous migrations and seed data insertion

SELECT public.trigger_advisor_creation();