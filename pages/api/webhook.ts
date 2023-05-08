import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { db } from "../../config/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    console.log("POST request received");
    console.log("Webjhook bitsh");
    const signature = req.headers["stripe-signature"] as string;
    console.log("sig:", signature);

    if (!signature) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Webhook Error: Signature missing." }));
      return;
    }

    try {
      const buf = await buffer(req);
      const event = stripe.webhooks.constructEvent(
        buf,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      );
      // const buf = await buffer(req);
      // //const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
      // const event = stripe.webhooks.constructEvent(
      //   buf.toString(),
      //   sig,
      //   process.env.STRIPE_WEBHOOK_SECRET ?? ""
      // );

      switch (event.type) {
        case "checkout.session.completed":
          const stripeData = event.data.object as Stripe.Checkout.Session;

          await updateFreeRewritesLeft(stripeData.customer_email ?? "");
          // Then define and call a function to handle the event payment_intent.succeeded
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // if (event.type === "") {
      //   const session = event.data.object as MyCheckoutSession;

      //   // Extract customer email from session and pass it to updateFreeRewritesLeft function
      //   //const customerEmail = session.customer_email;
      //   const customerEmail = session.metadata.customer_email;
      //   //await updateFreeRewritesLeft(customerEmail);
      //   await updateFreeRewritesLeft(customerEmail);
      //   console.log(
      //     `Customer email "${customerEmail}" extracted and passed to updateFreeRewritesLeft function.`
      //   );
      // }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ received: true }));
    } catch (err) {
      console.error(err);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Webhook Error" }));
    }
  }
}

async function updateFreeRewritesLeft(customerEmail: string) {
  console.log("updateFreeRewritesLeft called with email:", customerEmail);

  // Check if the customer email matches the logged in user's email

  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", customerEmail)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      console.log("querySnapshot.size:", querySnapshot.size);

      // Use updateDoc() to update the document with the new value
      await updateDoc(querySnapshot.docs[0].ref, {
        freeRewritesLeft: 1000,
      });
      console.log("freeRewritesLeft updated");
    }
    // Use getDoc() instead of doc() to check if the document exists
  } catch (e) {
    console.error("Error updating freeRewritesLeft: ", e);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
