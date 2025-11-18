import { cookies } from "next/headers";
import { auth } from '@/auth';

export async function POST(req: Request) {
  console.log("PROXY: NEW FILE UPLOAD REQUEST");
  // Read HttpOnly token
  const token = (await cookies()).get("authjs.session-token")?.value;
  console.log(token);
  if (!token) {
    return new Response("No auth token", { status: 401 });
  }

  const session = await auth();
  console.log("Access token: " + session?.accessToken);

  // Stream the incoming request directly to external API
  const externalRes = await fetch(process.env.UPLOAD_FILES_SERVICE_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      "x-file-sha256": req.headers.get("x-file-sha256") || "",
      // 👇 IMPORTANT: forward the same Content-Type boundary
      "Content-Type": req.headers.get("content-type") || "",
    },
    body: req.body, // <-- streaming passthrough, no buffering
    duplex: "half" as any, // ← Required for streaming body in Node.js
  } as any);

  // Pipe back external response to client
  return new Response(externalRes.body, {
    status: externalRes.status,
    headers: externalRes.headers,
  });
}