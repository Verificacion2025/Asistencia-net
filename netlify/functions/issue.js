// netlify/functions/issue.js
const crypto = require("crypto");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "CAMBIA_ESTE_SECRET";

exports.handler = async () => {
  const exp = Date.now() + 60 * 1000; // 60 segundos
  const payload = `${exp}`;
  const sig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");

  const token = Buffer.from(`${payload}.${sig}`).toString("base64url");

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
    body: JSON.stringify({
      ok: true,
      goUrl: `/form.html?token=${token}`,  // 👈 clave del cambio
    }),
  };
};
