# Curiosity Nexus Analytics

This document explains how to use the built-in analytics system to track archetype distribution across sessions.

## Overview

The analytics system automatically tracks every completed session, storing:
- Timestamp
- Archetype ID and name
- Session duration
- Total number of taps

All data is stored locally in the browser's localStorage.

## Using Analytics

Open the browser console and use the global `window.curiosityAnalytics` object:

### View Distribution

```javascript
// Log distribution to console
window.curiosityAnalytics.log()
```

This will show:
- Total number of sessions
- Top 10 archetypes with counts and percentages
- Bottlenecking warning if top 5 archetypes account for >70% of results

### Export Data

```javascript
// Download all data as JSON
window.curiosityAnalytics.export()
```

This creates a downloadable JSON file containing:
- Total sessions
- Export timestamp
- Distribution statistics
- All individual session data

### Get Raw Data

```javascript
// Get all session results
const results = window.curiosityAnalytics.getResults()

// Get calculated distribution
const distribution = window.curiosityAnalytics.getDistribution()
```

### Clear Data (for testing)

```javascript
// Clear all stored results
window.curiosityAnalytics.clear()
```

## Checking for Bottlenecking

The `log()` function automatically checks if results are bottlenecking:

- ✅ **Good distribution**: Top 5 archetypes < 70% of total
- ⚠️ **Bottlenecking**: Top 5 archetypes > 70% of total

If bottlenecking is detected, you may want to review the archetype scoring algorithm in `/src/data/archetypes30.ts`.

## Example Output

```
📊 === ARCHETYPE DISTRIBUTION ===
Total Sessions: 42

Top Archetypes:
1. The Wanderer: 6 (14.3%)
2. The Observer: 5 (11.9%)
3. The Dreamer: 4 (9.5%)
4. The Seeker: 4 (9.5%)
5. The Philosopher: 3 (7.1%)
...

✅ Good distribution: Top 5 archetypes account for 52.4% of results
```

## Data Format

### Session Result
```typescript
{
  timestamp: 1234567890,
  archetypeId: "wanderer",
  archetypeName: "The Wanderer",
  sessionDuration: 45230, // milliseconds
  totalTaps: 37
}
```

### Distribution Entry
```typescript
{
  archetype: "The Wanderer",
  count: 6,
  percentage: 14.3
}
```

## Storage Location

Data is stored in `localStorage` under the key: `curiosity-nexus-results`

You can view it directly in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Click on your domain
5. Find `curiosity-nexus-results`

## Privacy Note

All data is stored **locally** in the user's browser. No data is sent to any server. Each browser/device maintains its own separate analytics.
