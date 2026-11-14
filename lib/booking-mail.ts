type BookingMail = {
  to: string;
  when: string;
  reading: string;
  name: string;
};

export async function sendBookingEmails(input: BookingMail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !from) return false;

  const visitor = await send(key, {
    from,
    to: input.to,
    subject: `Request received — ${input.reading}`,
    text: [
      `Hello ${input.name},`,
      "",
      `Eliza has your request for ${input.reading} on ${input.when}.`,
      "She will confirm it or decline it from her calendar. This is not a confirmed appointment yet.",
    ].join("\n"),
  });

  const notify = process.env.BOOKING_NOTIFY_EMAIL;
  if (notify) {
    await send(key, {
      from,
      to: notify,
      subject: `Reading request — ${input.name}`,
      text: [
        `${input.name} (${input.to}) requested ${input.reading} on ${input.when}.`,
        "The request is on the readings calendar. Leave the event to accept it, or delete it to decline.",
      ].join("\n"),
    });
  }
  return visitor;
}

async function send(
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
