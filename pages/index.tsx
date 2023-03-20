import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bulletPoints, setBulletPoints] = useState("");
  const [generatedBulletPoints, setGeneratedBulletPoints] = useState<string>("");
  const [jobTitle, setJobTitle] = useState("");

  const bulletPointsRef = useRef<null | HTMLDivElement>(null);

  const scrollToGeneratedBulletPoints = () => {
    if (bulletPointsRef.current !== null) {
      bulletPointsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Using the provided ${bulletPoints}, create 6 bullet points that showcase the candidate's relevant skills and experiences for a ${jobTitle} position. Avoid using the exact job title in the bullet points. Aim for specificity and clarity in each point to demonstrate the candidate's suitability for the role. Always use this to start a bullet point ●`;
  //const prompt = `Using the provided ${bulletPoints}, create 6 bullet points that emphasize the candidate's qualifications and suitability for a ${jobTitle} position. Avoid directly stating the job title in the bullet points. Ensure that each bullet point is clear, concise, and highlights a specific skill or experience that makes the candidate a strong fit for the role. Always use this to start a bullet point ●`;
  //const prompt = `Rewrite the bullet points in a way that highlights the candidate's suitability for the ${jobTitle} position: ${bulletPoints}. Make sure you don't include the ${jobTitle} in the bullet points. Make sure you generate a total of 6 bullet points including the ones the user provided.`;

  const generateBulletPoints = async (e: any) => {
    e.preventDefault();
    setGeneratedBulletPoints("");
    setLoading(true);
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
  };
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Bullet Point Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Improve your bullet points using AI
        </h1>
        <form onSubmit={generateBulletPoints} className="max-w-xl w-full mt-10">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/job-title.png"
              width={30}
              height={30}
              alt="Job Title Icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter the job title you are applying for:
            </p>
          </div>
          <input
type="text"
className="w-full border border-gray-400 py-3 px-4 mt-2 rounded-md focus:outline-none focus:border-sky-500"
placeholder="e.g. Marketing Manager"
onChange={(e) => setJobTitle(e.target.value)}
required
/>
<div className="flex mt-10 items-center space-x-3">
<Image
           src="/bullet-points.png"
           width={30}
           height={30}
           alt="Bullet Points Icon"
           className="mb-5 sm:mb-0"
         />
<p className="text-left font-medium">
Enter your current bullet points:
</p>
</div>
<textarea
className="w-full border border-gray-400 py-3 px-4 mt-2 rounded-md focus:outline-none focus:border-sky-500"
placeholder="e.g. Increased social media engagement by 20%"
onChange={(e) => setBulletPoints(e.target.value)}
required
></textarea>
<button
         className="mt-10 w-full bg-sky-500 text-white py-3 rounded-md hover:bg-sky-600 transition-colors duration-300"
         type="submit"
       
       >
{loading ? (
<>
<LoadingDots />
<span className="sr-only">Generating bullet poinss...</span>
</>
) : (
"Generate Bullet Points"
)}
</button>

<div className="space-y-10 my-10">
  {generatedBulletPoints && (
    <>
      <div>
        <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
          Generated bullet points
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
<Footer />
<Toaster />
</div>
);
};

export default Home;