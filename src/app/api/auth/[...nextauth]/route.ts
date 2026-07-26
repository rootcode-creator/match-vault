// Dynamically import the auth handlers at runtime so initialization errors
// (for example DB or env issues) can be caught and returned as JSON instead
// of letting Next.js surface an HTML error page which the Auth.js client
// interprets as "Unexpected token '<'" when it expects JSON.

async function runHandler(method: "GET" | "POST", request: Request) {
	try {
		const mod = await import("@/auth");
		const handlers = mod.handlers;

		if (!handlers || typeof handlers[method] !== "function") {
			return new Response(JSON.stringify({ error: "Auth handler not found" }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}

		return handlers[method](request as any);
	} catch (err: any) {
		// Return a JSON error with the stack/message to make client-side debugging easier.
		const message = err instanceof Error ? err.message : String(err);
		const stack = err && err.stack ? String(err.stack) : undefined;
		const payload: Record<string, any> = { error: "Auth initialization failed", message };
		if (process.env.DEBUG_ERRORS === "true" || process.env.NODE_ENV !== "production") payload.stack = stack;

		return new Response(JSON.stringify(payload), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

export const GET = (request: Request) => runHandler("GET", request);
export const POST = (request: Request) => runHandler("POST", request);