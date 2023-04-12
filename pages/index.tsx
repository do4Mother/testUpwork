import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";

import LoadingDots from "../components/LoadingDots";
import { useAuth } from '../context/AuthContext';
import { useRouter } from "next/router";
import Link from 'next/link'
import  { db, storage } from "../config/firebase"
import { collection, addDoc, updateDoc, setDoc, serverTimestamp, getDoc, doc } from "firebase/firestore"; 
import { loadStripe } from '@stripe/stripe-js';
import Steps from "./steps";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bulletPoints, setBulletPoints] = useState("");
  const [generatedBulletPoints, setGeneratedBulletPoints] = useState<string>("");
  const [jobTitle, setJobTitle] = useState("");
  
  const auth = useAuth();
  const router = useRouter();

  const { user } = useAuth();
  const [freeRewritesLeft, setFreeRewritesLeft] = useState<number | null>(null);


  useEffect(() => {
    const fetchFreeRewritesLeft = async () => {
      if (auth.user) {
        const userId = auth.user.uid;
        const userDocRef = doc(db, "users", userId);
  
        try {
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFreeRewritesLeft(data?.freeRewritesLeft ?? null);
          } else {
            //console.log("userDoc does not exist");
          }
        } catch (e) {
          //console.error("Error fetching freeRewritesLeft: ", e);
        }
      }
    };
  
    fetchFreeRewritesLeft();
  }, [auth.user]);

  const bulletPointsRef = useRef<null | HTMLDivElement>(null);
  

  const scrollToGeneratedBulletPoints = () => {
    if (bulletPointsRef.current !== null) {
      bulletPointsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //const prompt = `Using the ${bulletPoints} provided, expand on each point to showcase the candidate's relevant skills and experiences for a ${jobTitle} position. To ensure clarity and specificity, avoid using the exact job title in the bullet points. Instead, use concrete examples and results to demonstrate the candidate's suitability for the role. Begin each bullet point with the symbol ● to maintain consistency. Give me 6 bullet points in total.`
  const prompt = `Using the provided ${bulletPoints}, create 6 bullet points that demonstrate the candidate's relevant skills and experiences for a ${jobTitle} position. Avoid using the exact job title in the bullet points. Instead, aim for specificity and clarity in each point to showcase the candidate's suitability for the role. Begin each bullet point with the symbol ● to maintain consistency.`
  // OG PROMPT const prompt = `Using the provided ${bulletPoints}, create 6 bullet points that showcase the candidate's relevant skills and experiences for a ${jobTitle} position. Avoid using the exact job title in the bullet points. Aim for specificity and clarity in each point to demonstrate the candidate's suitability for the role. Always use this to start a bullet point ●`;
  //const prompt = `Using the provided ${bulletPoints}, create 6 bullet points that emphasize the candidate's qualifications and suitability for a ${jobTitle} position. Avoid directly stating the job title in the bullet points. Ensure that each bullet point is clear, concise, and highlights a specific skill or experience that makes the candidate a strong fit for the role. Always use this to start a bullet point ●`;
  //const prompt = `Rewrite the bullet points in a way that highlights the candidate's suitability for the ${jobTitle} position: ${bulletPoints}. Make sure you don't include the ${jobTitle} in the bullet points. Make sure you generate a total of 6 bullet points including the ones the user provided.`;


  const generateBulletPoints = async (e: any) => {
    e.preventDefault();
    setGeneratedBulletPoints("");
    setLoading(true);
    //console.log("Free rewrites left:", freeRewritesLeft);

    //if (freeRewritesLeft <= 0) {
    //  toast.error("You need to pay to keep generating bullet points.");
    //  setLoading(false);
    //  return;
    //}

    // Validate form fields
  if (!bulletPoints || !jobTitle) {
    toast.error("Please fill in all the required fields.");
    setLoading(false);
    return;
  }
    
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBulletPoints((prev) => prev + chunkValue.replace(/\\n/g, "<br>"));
    }
    scrollToGeneratedBulletPoints();
    setLoading(false);
    await updateFreeRewritesLeft();
  };

  const updateFreeRewritesLeft = async () => {
    if (auth.user) {
      const userId = auth.user.uid;
      const userDocRef = doc(db, "users", userId);
  
      try {
        // Use getDoc() instead of doc() to check if the document exists
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const newFreeRewritesLeft = userDoc.data().freeRewritesLeft - 1;
  
          // Use updateDoc() to update the document with the new value
          await updateDoc(userDocRef, {
            freeRewritesLeft: newFreeRewritesLeft,
          });
  
          //console.log("freeRewritesLeft updated", newFreeRewritesLeft);
          // Update state
          setFreeRewritesLeft(newFreeRewritesLeft);
        } else {
          //console.log("userDoc does not exist");
        }
      } catch (e) {
        //console.error("Error updating freeRewritesLeft: ", e);
      }
    }
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/hello', {
        method: 'POST',
      });

      const { sessionId } = await response.json();

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };


  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Resume Boost AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
     
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-black text-slate-900">
          Boost your resume using AI 🤖
        </h1>
   
        <form onSubmit={generateBulletPoints} className="max-w-xl w-full mt-10">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left text-lg font-black">
              Enter the job title you are applying for:
            </p>
          </div>
          <input
type="text"
className="w-full border border-gray-400 py-3 px-4 mt-2 rounded-md focus:outline-none focus:border-sky-500"
placeholder="e.g. Software Engineer"
onChange={(e) => setJobTitle(e.target.value)}
required
/>
<div className="flex mt-10 items-center space-x-3">
<p className="text-left text-lg font-black">
Enter your current bullet points (2 bullet points at a time or max 320 characters):
</p>
</div>
<textarea
className="w-full border border-gray-400 py-3 px-4 mt-2 rounded-md focus:outline-none focus:border-sky-500 h-40"
placeholder="e.g. Performed application software design and development as well as maintenance activities for products in production using Python"
maxLength={320}
onChange={(e) => setBulletPoints(e.target.value)}
required
></textarea>
{!auth.user ? (

<Link href="/signup">
  <button
  className="mt-10 w-full bg-gradient-to-r from-gray-500 via-red-500 to-red-500 text-white py-3 rounded-md transition-colors duration-300 hover:from-red-500 hover:via-pink-500 hover:to-gray-500"
  type="submit"
  disabled={loading}
>
  Sign Up to {freeRewritesLeft === 0 ? "Get Infinite Rewrites" : "Start Improving your Resume"}
</button>
</Link>
) : (
<>
  {freeRewritesLeft === 0 ? (
    <>
    <button
      
      className="mt-10 w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-300"
      type="button"
    >
      <a href="https://buy.stripe.com/8wM8xk5MZ5IC9i03cd">
      Get Infinite Rewrites for $2.99 (Beta Price)
      </a>
  
    </button>
     <p className="text-center text-md font-black py-4">
     Allow 2 - 5 minutes after paying for unlimited access to be activated ⏲️  
     </p>
     </>
  ) : (
    <button
      onClick={generateBulletPoints}
      className="mt-10 w-full bg-gradient-to-r from-gray-500 via-red-500 to-red-500 text-white py-3 rounded-md transition-colors duration-300 hover:from-red-500 hover:via-pink-500 hover:to-gray-500"
      type="button"
    >
      {loading ? (
        <>
          Generating New Bullet Points <LoadingDots />
        </>
      ) : (
        "Generate Bullet Points"
      )}
    </button>
  )}
</>
)}

<div className="space-y-10 my-10">
  {generatedBulletPoints && (
    <>
      <div>
        <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
          Generated Bullet Points 👇🏼
        </h2>
      </div>
      <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
        {generatedBulletPoints
          .split("●")
          .map((generatedBulletPoint, index) => {
            if (index === 0 && generatedBulletPoint.trim() === "") {
              // skip first empty string
              return null;
            }
            return (
              <div
                className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                onClick={() => {
                  navigator.clipboard.writeText(generatedBulletPoint.trim());
                  toast("Bullet point copied to clipboard", {
                    icon: "✂️",
                  });
                }}
                key={index}
              >
                <p>{generatedBulletPoint.trim()}</p>
              </div>
            );
          })}
      </div>
    </>
  )}
</div>




</form>
</main>
<Steps />
<Footer />
<Toaster />
</div>
);
};

export default Home;