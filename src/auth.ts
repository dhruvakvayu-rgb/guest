export type AuthRole = "customer" | "admin"

export type AuthResult = {
  authenticated: boolean

  role?: AuthRole

  displayName?: string

  message?: string
}

type AuthResponse = {
  authenticated?: unknown

  user?: {
    role?: unknown

    displayName?: unknown
  }

  message?: unknown
}

const getAuthApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_AUTH_API_URL?.trim()

  if (!configuredUrl) {
    throw new Error(
      "Secure sign-in is unavailable because no authentication backend is configured. Set VITE_AUTH_API_URL to your HTTPS auth API to enable accounts.",
    )
  }

  let url: URL

  try {
    url = new URL(configuredUrl)
  } catch {
    throw new Error("VITE_AUTH_API_URL must be a valid absolute URL.")
  }

  const isLocalDevelopment =
    url.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(url.hostname)

  if (url.protocol !== "https:" && !isLocalDevelopment) {
    throw new Error("The authentication API must use HTTPS.")
  }

  return url.toString().replace(/\/+$/, "")
}

export async function authenticate(
  mode: "login" | "register",

  credentials: { email: string; password: string; name?: string },
): Promise<AuthResult> {
  const baseUrl = getAuthApiUrl()

  let response: Response

  try {
    response = await fetch(`${baseUrl}/auth/${mode}`, {
      method: "POST",

      credentials: "include",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(credentials),
    })
  } catch {
    throw new Error(
      "Could not reach the authentication service. Check the API URL and server availability.",
    )
  }

  let payload: AuthResponse = {}

  if (response.headers.get("content-type")?.includes("application/json")) {
    try {
      payload = ((await response.json()) as AuthResponse)
    } catch {
      throw new Error("The authentication service returned invalid JSON.")
    }
  }

  if (!response.ok) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : `Authentication failed (HTTP ${response.status}).`,
    )
  }

  if (payload.authenticated !== true) {
    return {
      authenticated: false,

      message:
        typeof payload.message === "string"
          ? payload.message
          : "Account request received. Complete the verification step before signing in.",
    }
  }

  const role = payload.user?.role

  if (role !== "customer" && role !== "admin") {
    throw new Error(
      "The authentication service did not return a valid account role.",
    )
  }

  return {
    authenticated: true,

    role,

    displayName:
      typeof payload.user?.displayName === "string"
        ? payload.user.displayName
        : undefined,
  }
}
