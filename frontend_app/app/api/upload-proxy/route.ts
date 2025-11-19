import { cookies } from "next/headers";
import { auth } from '@/auth';

export async function POST(req: Request) {
  console.log("PROXY: NEW FILE UPLOAD REQUEST");
  // Read HttpOnly token
  const token = (await cookies()).get("authjs.session-token")?.value;
  console.log("RECEIVED TOKEN: " + token);
  if (!token) {
    return new Response("No auth token", { status: 401 });
  }

  const session = await auth();
  const uri = process.env.UPLOAD_FILES_SERVICE_URL!;
  console.log("Access token: " + session?.accessToken);
  console.log("UPLOAD FILES SERVICE URL: " + process.env.UPLOAD_FILES_SERVICE_URL!);
  console.log("SESSION TOACCESS TOKEN: " + session?.accessToken);
  // Stream the incoming request directly to external API
  // Forward request to external service
  const externalRes = await fetch(process.env.UPLOAD_FILES_SERVICE_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      "x-file-sha256": req.headers.get("x-file-sha256") || "",
      // Only forward Content-Type if present
      ...(req.headers.get("content-type")
        ? { "Content-Type": req.headers.get("content-type")! }
        : {}),
    },
    body: req.body,
    duplex: "half"
  } as any);

  // Log result
  console.log(externalRes.ok ? "ALL OK" : "ALL NOT OK");

  // Clone headers safely for browser response
  const safeHeaders = new Headers(externalRes.headers);
  safeHeaders.delete("transfer-encoding");
  safeHeaders.delete("connection");
  safeHeaders.delete("content-encoding");

  // Return streamed response back to client
  return new Response(externalRes.body, {
    status: externalRes.status,
    headers: safeHeaders,
  });
}