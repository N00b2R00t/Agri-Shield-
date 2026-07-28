/**
 * AgriShield AI Security Module
 * Provides SHA-256 password hashing, XSS string sanitization, input validation,
 * and rate-limiting brute-force defense mechanisms.
 */

/**
 * Hashes a plaintext password using native Web Crypto SHA-256 with salt
 */
export async function hashPassword(password: string, salt: string = 'agrishield-salt-2026'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Sanitizes user input string against HTML injection and XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates email format strictly
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Evaluates password strength (length, numbers, special characters)
 */
export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  score: number;
  feedback: string;
} {
  let score = 0;
  if (!password) return { isStrong: false, score: 0, feedback: 'Password is required' };

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let feedback = 'Weak password';
  if (score >= 4) feedback = 'Very Strong password';
  else if (score >= 3) feedback = 'Moderate password';
  else if (score >= 2) feedback = 'Basic password';

  return {
    isStrong: password.length >= 6,
    score,
    feedback,
  };
}

/**
 * Simple client-side Rate Limiter for Login Attempt Security
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lockedUntil: number }> = new Map();

  checkAllowed(key: string, maxAttempts: number = 5, lockDurationMs: number = 180000): {
    allowed: boolean;
    remainingMs: number;
  } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      return { allowed: true, remainingMs: 0 };
    }

    if (record.lockedUntil > now) {
      return { allowed: false, remainingMs: record.lockedUntil - now };
    }

    if (record.lockedUntil <= now && record.count >= maxAttempts) {
      // Lock expired, reset
      this.attempts.delete(key);
      return { allowed: true, remainingMs: 0 };
    }

    return { allowed: true, remainingMs: 0 };
  }

  recordFailedAttempt(key: string, maxAttempts: number = 5, lockDurationMs: number = 180000): void {
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, lockedUntil: 0 };

    record.count += 1;
    if (record.count >= maxAttempts) {
      record.lockedUntil = now + lockDurationMs;
    }
    this.attempts.set(key, record);
  }

  recordSuccess(key: string): void {
    this.attempts.delete(key);
  }
}

export const loginRateLimiter = new RateLimiter();
