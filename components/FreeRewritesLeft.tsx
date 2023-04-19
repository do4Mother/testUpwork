import React from "react";

type FreeRewritesLeftProps = {
  freeRewritesLeft: number | null;
};

const FreeRewritesLeft: React.FC<FreeRewritesLeftProps> = ({ freeRewritesLeft }) => {
  return (
    <>
      <div className={`mt-5 ml-2 ${freeRewritesLeft === null ? 'text-xl' : 'text-2xl'} font-bold`}>Tokens Left 🪙:</div>
    <div className={`ml-2 ${freeRewritesLeft === null ? 'text-xl' : 'text-3xl'} text-yellow-500 font-bold`}>
      {freeRewritesLeft === null ? "" : freeRewritesLeft}
    </div>
  </>
  );
};

export default FreeRewritesLeft;