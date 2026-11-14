import tls from "node:tls";

type BookingMail = {
  to: string;
  when: string;
  reading: string;
  name: string;
};

export async function sendBookingEmails(input: BookingMail) {
  const visitorText = [
    `Hello ${input.name},`,
    "",
    `Eliza has your request for ${input.reading} on ${input.when}.`,
    "She will confirm it or decline it from her calendar. This is not a confirmed appointment yet.",
  ].join("\n");
  const elizaText = [
    `${input.name} (${input.to}) requested ${input.reading} on ${input.when}.`,
    "The request is on the readings calendar. Leave the event to accept it, or delete it to decline.",
  ].join("\n");
  const notify = process.env.BOOKING_NOTIFY_EMAIL?.trim();

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (gmailUser && gmailPassword) {
    const visitor = await sendGmail({
      user: gmailUser,
      password: gmailPassword,
      to: input.to,
      subject: `Request received — ${input.reading}`,
      text: visitorText,
    });
    if (notify) {
      await sendGmail({
        user: gmailUser,
        password: gmailPassword,
        to: notify,
        subject: `Reading request — ${input.name}`,
        text: elizaText,
      });
    }
    return visitor;
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !from) return false;
  const visitor = await sendResend(key, {
    from,
    to: input.to,
    subject: `Request received — ${input.reading}`,
    text: visitorText,
  });
  if (notify) {
    await sendResend(key, {
      from,
      to: notify,
      subject: `Reading request — ${input.name}`,
      text: elizaText,
    });
  }
  return visitor;
}

async function sendResend(
  key: string,
  message: { from: string; to: string; subject: string; text: string },
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  return response.ok;
}

function sendGmail(message: {
  user: string;
  password: string;
  to: string;
  subject: string;
  text: string;
}) {
  const body = [
    `From: ${message.user}`,
    `To: ${message.to}`,
    `Subject: ${message.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    message.text.replace(/^\./gm, ".."),
  ].join("\r\n");

  return new Promise<boolean>((resolve) => {
    const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
    let buffer = "";
    const queue = [
      `EHLO atelier-eliza`,
      `AUTH LOGIN`,
      Buffer.from(message.user).toString("base64"),
      Buffer.from(message.password).toString("base64"),
      `MAIL FROM:<${message.user}>`,
      `RCPT TO:<${message.to}>`,
      `DATA`,
      `${body}\r\n.`,
      `QUIT`,
    ];
    let step = 0;

    const fail = () => {
      socket.destroy();
      resolve(false);
    };

    socket.setTimeout(12_000, fail);
    socket.on("error", fail);
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/);
      if (!lines.at(-1)) lines.pop();
      const last = lines.at(-1) ?? "";
      if (!/^\d{3} /.test(last)) return;
      buffer = "";
      const code = Number(last.slice(0, 3));
      if (code >= 400) {
        fail();
        return;
      }
      const command = queue[step];
      step += 1;
      if (!command) {
        socket.end();
        resolve(true);
        return;
      }
      socket.write(`${command}\r\n`);
    });
  });
}
