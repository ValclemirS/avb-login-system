import { NextRequest } from 'next/server';


// Interface para armazenar tentativas
interface Attempt {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
}

// Armazenamento em memória (em produção, use Redis)
const attempts = new Map<string, Attempt>();

// Configurações
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5, // Máximo de tentativas
  WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  BLOCK_DURATION: 30 * 60 * 1000, // 30 minutos de bloqueio
  IP_WHITELIST: ['127.0.0.1', '::1'] // IPs liberados
};

export function rateLimit(request: NextRequest) {
  const ip = getClientIP(request);
  const key = `login:${ip}`;
  
  // Limpar tentativas antigas
  cleanupOldAttempts();
  
  // Verificar se IP está na whitelist
  if (RATE_LIMIT.IP_WHITELIST.includes(ip)) {
    return { allowed: true, remaining: RATE_LIMIT.MAX_ATTEMPTS };
  }
  
  const now = Date.now();
  const attempt = attempts.get(key) || { 
    count: 0, 
    firstAttempt: now, 
    lastAttempt: now 
  };
  
  // Verificar se está bloqueado
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    const remainingTime = Math.ceil((attempt.blockedUntil - now) / 1000 / 60);
    return { 
      allowed: false, 
      reason: 'blocked',
      remainingTime 
    };
  }
  
  // Resetar contador se a janela de tempo expirou
  if (now - attempt.firstAttempt > RATE_LIMIT.WINDOW_MS) {
    attempt.count = 0;
    attempt.firstAttempt = now;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  
  // Bloquear se excedeu o limite
  if (attempt.count > RATE_LIMIT.MAX_ATTEMPTS) {
    attempt.blockedUntil = now + RATE_LIMIT.BLOCK_DURATION;
    attempts.set(key, attempt);
    
    return { 
      allowed: false, 
      reason: 'rate_limit_exceeded',
      remainingTime: Math.ceil(RATE_LIMIT.BLOCK_DURATION / 1000 / 60)
    };
  }
  
  attempts.set(key, attempt);
  
  return { 
    allowed: true, 
    remaining: RATE_LIMIT.MAX_ATTEMPTS - attempt.count 
  };
}

function getClientIP(request: NextRequest): string {
  // Tentar pegar IP real do cliente
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback para IP remoto (NextRequest não expõe request.ip)
  return 'unknown';
}

function cleanupOldAttempts() {
  const now = Date.now();
  const cutoff = now - (RATE_LIMIT.WINDOW_MS + RATE_LIMIT.BLOCK_DURATION);
  
  for (const [key, attempt] of attempts.entries()) {
    if (attempt.lastAttempt < cutoff && !attempt.blockedUntil) {
      attempts.delete(key);
    }
  }
}

// Função para registrar tentativa bem-sucedida
export function resetAttempts(ip: string) {
  const key = `login:${ip}`;
  attempts.delete(key);
}

// Função para obter estatísticas (para dashboard)
export function getRateLimitStats() {
  const now = Date.now();
  const blockedIPs = Array.from(attempts.entries())
    .filter(([_, attempt]) => attempt.blockedUntil && now < attempt.blockedUntil)
    .map(([key]) => key.replace('login:', ''));
  
  return {
    totalBlocked: blockedIPs.length,
    blockedIPs,
    totalTracked: attempts.size
  };
}
