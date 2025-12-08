/**
 * Maintenance Mode Configuration
 *
 * To enable maintenance mode:
 * 1. Set MAINTENANCE_MODE = true below
 * 2. Rebuild and deploy
 *
 * To disable:
 * 1. Set MAINTENANCE_MODE = false
 * 2. Rebuild and deploy
 */

export const MAINTENANCE_MODE = false;

export const MAINTENANCE_CONFIG = {
  title: "Curiosity Nexus",
  message: "We're currently performing maintenance to improve your experience.",
  submessage: "We'll be back shortly. Thank you for your patience.",
  estimatedReturn: null, // e.g., "December 9, 2025 at 3:00 PM PST" or null
};
