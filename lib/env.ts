const required = [
  "DATABASE_URL",
  "ADMIN_PASSWORD",
  "ADMIN_JWT_SECRET",
] as const;

export function validateEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
  if ((process.env.ADMIN_JWT_SECRET?.length ?? 0) < 32) {
    throw new Error("ADMIN_JWT_SECRET must be at least 32 characters");
  }
}
