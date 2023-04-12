import React from 'react';
import Image from 'next/image';

const HowItWorks = () => {
  return (
<>
<h2 className="md:text-4xl text-3xl max-w-[708px] font-black text-black">
          How does ResumeAI work? 
        </h2>
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-4 mb-4 border-2 border-gradient-to-r from-gray-500 via-red-500 to-red-500">
  <div className="md:flex ">
    <div className="md:shrink-0 ">
    <Image
              src="/step1.gif"
              alt="Step 1"
              width={350}
              height={250}
              className="rounded-md "
            />
    </div>
    <div className="p-8 ">
      <div className="uppercase tracking-wide text-md text-red-600 font-semibold">Step 1</div>
      <p  className="block mt-1 text-lg leading-tight font-medium text-black ">Fill out the information</p>
      <p className="mt-2 text-slate-500">Enter the job title of the position that you are applying for.</p>
      <p className="mt-2 text-slate-500">Enter the bullet points you want to improve.</p>
      
    </div>
  </div>
</div>

<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-4 border-2 border-gradient-to-r from-gray-500 via-red-500 to-red-500">
  <div className="md:flex">
    <div className="md:shrink-0">
    <Image
              src="/step2.gif"
              alt="Step 1"
              width={350}
              height={250}
              className="rounded-md"
            />
    </div>
    <div className="p-8">
      <div className="uppercase tracking-wide text-md text-red-600 font-semibold">Step 2</div>
      <p  className="block mt-1 text-lg leading-tight font-medium text-black ">Let ResumeBoostAI take care of the rest</p>
      <p className="mt-2 text-slate-500">Our AI tool will start improving the existing bullet points provided, and add a couple of more bullet points as suggestions.</p>
    </div>
  </div>
</div>
<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-4 border-2 border-gradient-to-r from-gray-500 via-red-500 to-red-500">
  <div className="md:flex">
    <div className="md:shrink-0">
    <Image
              src="/step3.gif"
              alt="Step 1"
              width={350}
              height={250}
              className="rounded-md"
            />
    </div>
    <div className="p-8">
      <div className="uppercase tracking-wide text-md text-red-600 font-semibold">Step 3</div>
      <p  className="block mt-1 text-lg leading-tight font-medium text-black ">Copy the new bullet points</p>
      <p className="mt-2 text-slate-500">This is the easy part!</p>
      <p className="mt-2 text-slate-500">Choose, copy, and paste the new bullet points into your resume.</p>
    </div>
  </div>
</div>
   
    </>
  );
};

export default HowItWorks;