// Rate limiting implementation for API endpoints
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async (request: Request): Promise<{ success: boolean; remaining: number }> => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const now = Date.now();
    const key = `${ip}`;
    
    const current = requestCounts.get(key);
    
    if (!current || now > current.resetTime) {
      // Reset window
      requestCounts.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { success: true, remaining: config.maxRequests - 1 };
    }
    
    if (current.count >= config.maxRequests) {
      return { success: false, remaining: 0 };
    }
    
    current.count++;
    return { success: true, remaining: config.maxRequests - current.count };
  };
}

// Configurações pré-definidas
export const defaultRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 100
});

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto  
  maxRequests: 10
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5
});
