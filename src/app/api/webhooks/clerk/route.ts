import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  createUserSubscription,
  getUserSubscription,
} from "@/server/db/subscrition";
import { Tier } from "@prisma/client";
import { deleteUser } from "@/server/db/users";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const headerPayload = headers();
  const svixId = (await headerPayload).get("svix-id");
  const svixTimestamp = (await headerPayload).get("svix-timestamp");
  const svixSignature = (await headerPayload).get("svix-signature");

  // Check for missing headers
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Parse the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Ensure the environment variable is defined
  const clerkSecretWebhook = process.env.CLERK_SECRET_WEBHOOK;
  if (!clerkSecretWebhook) {
    throw new Error("CLERK_SECRET_WEBHOOK is not defined");
  }

  const wh = new Webhook(clerkSecretWebhook);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", {
      status: 400,
    });
  }

  // Handle the event based on its type
  switch (event.type) {
    case "user.created": {
      await createUserSubscription({
        clerkUserId: event.data.id,
        tier: Tier.FREE,
      });

      break;
    }
    case "user.deleted": {
      if (event.data.id != null) {
        const userSubscription = await getUserSubscription(event.data.id);
        if (userSubscription?.stripeSubscriptionId != null) {
          await stripe.subscriptions.cancel(
            userSubscription.stripeSubscriptionId
          );
        }
        await deleteUser(event.data.id);
      }
      break;
    }
  }

  return new Response("", { status: 200 });
}
