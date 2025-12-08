/**
 * Analytics utilities for tracking archetype distribution
 * Stores results in localStorage and provides export functionality
 */

export interface SessionResult {
  timestamp: number;
  archetypeId: string;
  archetypeName: string;
  sessionDuration: number; // milliseconds
  totalTaps: number;
}

const STORAGE_KEY = 'curiosity-nexus-results';

/**
 * Save a completed session result
 */
export function saveSessionResult(result: SessionResult): void {
  try {
    const existing = getSessionResults();
    existing.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    console.log('📊 Session result saved:', result.archetypeName);
  } catch (error) {
    console.error('Failed to save session result:', error);
  }
}

/**
 * Get all stored session results
 */
export function getSessionResults(): SessionResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load session results:', error);
    return [];
  }
}

/**
 * Calculate archetype distribution statistics
 */
export function getArchetypeDistribution(): {
  archetype: string;
  count: number;
  percentage: number;
}[] {
  const results = getSessionResults();
  const total = results.length;

  if (total === 0) return [];

  // Count occurrences
  const counts = new Map<string, number>();
  results.forEach(result => {
    const current = counts.get(result.archetypeName) || 0;
    counts.set(result.archetypeName, current + 1);
  });

  // Convert to array and sort by count (descending)
  const distribution = Array.from(counts.entries())
    .map(([archetype, count]) => ({
      archetype,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  return distribution;
}

/**
 * Export all results as downloadable JSON
 */
export function exportResults(): void {
  const results = getSessionResults();
  const distribution = getArchetypeDistribution();

  const exportData = {
    totalSessions: results.length,
    exportedAt: new Date().toISOString(),
    distribution,
    sessions: results,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `curiosity-nexus-analytics-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('📥 Analytics exported');
}

/**
 * Log distribution to console (for quick checking)
 */
export function logDistribution(): void {
  const distribution = getArchetypeDistribution();
  const results = getSessionResults();

  console.log('📊 === ARCHETYPE DISTRIBUTION ===');
  console.log(`Total Sessions: ${results.length}`);
  console.log('\nTop Archetypes:');
  distribution.slice(0, 10).forEach((entry, idx) => {
    console.log(
      `${idx + 1}. ${entry.archetype}: ${entry.count} (${entry.percentage.toFixed(1)}%)`
    );
  });

  if (distribution.length > 10) {
    console.log(`\n... and ${distribution.length - 10} more archetypes`);
  }

  // Check for bottlenecking
  const top5Percentage = distribution
    .slice(0, 5)
    .reduce((sum, entry) => sum + entry.percentage, 0);

  if (top5Percentage > 70) {
    console.warn(
      `⚠️ Bottlenecking detected: Top 5 archetypes account for ${top5Percentage.toFixed(1)}% of results`
    );
  } else {
    console.log(
      `✅ Good distribution: Top 5 archetypes account for ${top5Percentage.toFixed(1)}% of results`
    );
  }
}

/**
 * Clear all stored results (for testing)
 */
export function clearResults(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ All results cleared');
}

// Add to window for console access
if (typeof window !== 'undefined') {
  (window as any).curiosityAnalytics = {
    export: exportResults,
    log: logDistribution,
    clear: clearResults,
    getResults: getSessionResults,
    getDistribution: getArchetypeDistribution,
  };
  console.log('💡 Analytics available via: window.curiosityAnalytics');
}
