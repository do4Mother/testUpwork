import { doc, getDoc, updateDoc } from "firebase/firestore";
import http from "http";
import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import { auth, db } from "../../config/firebase";

interface MyCheckoutSession extends Stripe.Checkout.Session {
  metadata: {
    customer_email: string;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
});

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Request received");

  const { method, headers } = req;
  console.log("Headers:", headers, req.body);
  console.log("Authorization header:", headers.authorization);

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const sig = headers["stripe-signature"];

  try {
    // Retrieve the authenticated user's ID from the request headers
    const userId = headers.authorization?.replace("Bearer ", "");
    console.log("userId", userId);

    const parsingBody = JSON.parse(req.body);

    console.log("user", parsingBody["userEmail"], parsingBody);

    // Create a new Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1N5VvHETFVcIRlmDSGVj8LZ2", // replace with the actual price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      client_reference_id: userId,
      customer_email: parsingBody["userEmail"],
    });

    // Send the session ID back to the client
    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ statusCode: 500, message: err.message });
    } else {
      res
        .status(500)
        .json({ statusCode: 500, message: "Unknown error occurred." });
    }
  }
};

const webhookHandler = async (
  req: NextApiRequest,
  res: http.ServerResponse
) => {
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
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        const customer = paymentIntentSucceeded.customer as Stripe.Customer;

        await updateFreeRewritesLeft(customer.email ?? "");
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
};

async function updateFreeRewritesLeft(customerEmail: string) {
  console.log("updateFreeRewritesLeft called with email:", customerEmail);

  // Check if the customer email matches the logged in user's email

  const userDocRef = doc(db, "users", customerEmail);

  try {
    // Use getDoc() instead of doc() to check if the document exists
    const userDoc = await getDoc(userDocRef);
    console.log("userDoc.exists():", userDoc.exists());

    if (userDoc.exists()) {
      // Use updateDoc() to update the document with the new value
      await updateDoc(userDocRef, {
        freeRewritesLeft: 1000,
      });
      console.log("freeRewritesLeft updated");
    } else {
      console.log("userDoc does not exist");
    }
  } catch (e) {
    console.error("Error updating freeRewritesLeft: ", e);
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default cors(
  (
    req: NextApiRequest | http.IncomingMessage,
    res: NextApiResponse | http.ServerResponse
  ) => {
    // if (
    //   req instanceof http.IncomingMessage &&
    //   req.method === "POST" &&
    //   req.url === "http://localhost:3000/api/hello"
    // ) {
    //   return webhookHandler(req, res);
    // }

    return handler(req as NextApiRequest, res as NextApiResponse);
  }
);
