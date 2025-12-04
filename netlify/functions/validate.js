// netlify/functions/validate.js
const crypto = require("crypto");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "CAMBIA_ESTE_SECRET";

exports.handler = async (event) => {
  const token = event.queryStringParameters?.token;

  if (!token) {
    return {
      statusCode: 200,
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ ok:false })
    };
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [payload, sig] = decoded.split(".");

    const expectedSig = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(payload)
      .digest("hex");

    if (sig !== expectedSig) throw new Error("bad sig");

    const exp = Number(payload);
    if (Date.now() > exp) throw new Error("expired");

    return {
      statusCode: 200,
      headers: { "content-type":"application/json", "cache-control":"no-store" },
      body: JSON.stringify({ ok:true })
    };

  } catch {
    return {
      statusCode: 200,
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ ok:false })
    };
  }
};
