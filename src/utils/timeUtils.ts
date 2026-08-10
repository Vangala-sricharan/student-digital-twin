/**
 * Utility functions for Indian Standard Time (IST) calculations and greetings.
 */

export function getISTHour(): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find((p) => p.type === 'hour');
    const hour = hourPart ? parseInt(hourPart.value, 10) : new Date().getHours();
    return hour === 24 ? 0 : hour;
  } catch (err) {
    console.error('Error getting IST hour:', err);
    return new Date().getHours();
  }
}

export function getISTGreeting(): string {
  const hour = getISTHour();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  }
  if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  }
  if (hour >= 17 && hour < 21) {
    return 'Good evening';
  }
  return 'Good night';
}
