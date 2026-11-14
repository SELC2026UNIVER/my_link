const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const DANGEROUS_SCHEME_PATTERN = /^(javascript|data|vbscript|file):/i;
const SIMPLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/;

export const MAX_LINK_TITLE_LENGTH = 50;
export const MAX_ACTIVE_ITEMS = 50;

export const RESERVED_USERNAMES = new Set([
  "admin",
  "login",
  "onboarding",
  "api",
  "auth",
  "settings",
  "about",
  "demo",
  "links",
  "404",
  "robots.txt",
  "sitemap.xml",
]);

/**
 * 허용된 스킴(http, https, mailto)인지 검증해 안전한 href만 반환한다.
 * 유효하지 않거나 위험한 스킴이면 "#"을 반환한다.
 */
export function resolveSafeHref(rawUrl?: string | null): string {
  if (!rawUrl) return "#";
  const trimmed = rawUrl.trim();
  if (!trimmed || DANGEROUS_SCHEME_PATTERN.test(trimmed)) {
    return "#";
  }

  try {
    const parsed = new URL(trimmed);
    if (!SAFE_URL_PROTOCOLS.has(parsed.protocol)) {
      return "#";
    }
    if (parsed.protocol === "mailto:") {
      const address = parsed.pathname.trim();
      if (!SIMPLE_EMAIL_PATTERN.test(address)) {
        return "#";
      }
    }
    return trimmed;
  } catch {
    return "#";
  }
}

/**
 * 새 탭(_blank)으로 열어야 하는 외부 HTTP(S) 링크인지 판별한다.
 */
export function isExternalHttpUrl(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

/**
 * URL 입력 시 프로토콜이 없으면 자동으로 https://를 붙여 정규화한다.
 */
export function normalizeUrlInput(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  if (
    DANGEROUS_SCHEME_PATTERN.test(trimmed) ||
    /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
  ) {
    return trimmed;
  }

  if (SIMPLE_EMAIL_PATTERN.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  return `https://${trimmed}`;
}

/**
 * 링크 및 소셜 URL 유효성 검사 (PRD F-02 규칙 준수).
 */
export function validateLinkUrl(rawUrl: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, normalized: "", error: "URL을 입력해 주세요" };
  }

  if (DANGEROUS_SCHEME_PATTERN.test(trimmed)) {
    return {
      valid: false,
      normalized: trimmed,
      error: "허용되지 않는 URL입니다",
    };
  }

  const normalized = normalizeUrlInput(trimmed);
  if (normalized.length > 2048) {
    return {
      valid: false,
      normalized,
      error: "URL은 최대 2,048자까지 입력할 수 있습니다",
    };
  }

  try {
    const parsed = new URL(normalized);
    if (!SAFE_URL_PROTOCOLS.has(parsed.protocol)) {
      return {
        valid: false,
        normalized,
        error: "허용되지 않는 URL입니다",
      };
    }

    if (parsed.protocol === "mailto:") {
      const address = parsed.pathname.trim();
      if (!SIMPLE_EMAIL_PATTERN.test(address)) {
        return {
          valid: false,
          normalized,
          error: "올바른 이메일 주소 형식이 아닙니다",
        };
      }
      return { valid: true, normalized };
    }

    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return {
        valid: false,
        normalized,
        error:
          "올바른 URL 형식이 아닙니다 (예: https://example.com 또는 mailto:name@example.com)",
      };
    }

    return { valid: true, normalized };
  } catch {
    return {
      valid: false,
      normalized,
      error:
        "올바른 URL 형식이 아닙니다 (예: https://example.com 또는 mailto:name@example.com)",
    };
  }
}

/**
 * 이메일 주소 형식을 검사한다.
 */
export function validateEmail(rawEmail: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = rawEmail.trim().toLowerCase();
  if (!normalized || !SIMPLE_EMAIL_PATTERN.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: "올바른 이메일 형식이 아닙니다",
    };
  }
  return { valid: true, normalized };
}

/**
 * username 규칙(3~20자, 소문자·숫자·밑줄·마침표, 예약어 제외)을 검사한다.
 */
export function validateUsernameFormat(rawUsername: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = rawUsername.trim().toLowerCase();
  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: "영문 소문자, 숫자, 밑줄(_), 마침표(.) 3~20자로 입력해 주세요",
    };
  }
  if (
    normalized.startsWith(".") ||
    normalized.endsWith(".") ||
    normalized.includes("..")
  ) {
    return {
      valid: false,
      normalized,
      error: "마침표(.)는 시작이나 끝에 쓸 수 없으며 연속으로 사용할 수 없습니다",
    };
  }
  if (RESERVED_USERNAMES.has(normalized)) {
    return {
      valid: false,
      normalized,
      error: "예약된 시스템 이름은 사용할 수 없습니다",
    };
  }
  return { valid: true, normalized };
}

/**
 * 링크 제목 규칙(앞뒤 공백 제거 후 1~50자)을 검사한다.
 */
export function validateLinkTitle(rawTitle: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = rawTitle.trim();
  if (!normalized) {
    return {
      valid: false,
      normalized: "",
      error: "제목을 입력해 주세요",
    };
  }
  if (normalized.length > MAX_LINK_TITLE_LENGTH) {
    return {
      valid: false,
      normalized,
      error: `제목은 최대 ${MAX_LINK_TITLE_LENGTH}자까지 입력할 수 있습니다`,
    };
  }
  return { valid: true, normalized };
}

/**
 * 링크 카드 보조 텍스트용 표시 문자열을 생성한다.
 */
export function formatDisplayUrl(rawUrl?: string): string {
  if (!rawUrl) return "";
  const safe = resolveSafeHref(rawUrl);
  if (safe === "#") return "";

  if (safe.startsWith("mailto:")) {
    return safe.replace(/^mailto:/i, "");
  }

  try {
    const parsed = new URL(safe);
    const host = parsed.hostname.replace(/^www\./i, "");
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${host}${path}`;
  } catch {
    return safe;
  }
}
