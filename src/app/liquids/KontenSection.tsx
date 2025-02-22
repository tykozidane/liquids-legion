import React from "react";

function KontenSection({youtube}:any) {
  return (
    <div className="w-full flex justify-center items-center">
      <div>
        <iframe width="560" height="315" src={youtube} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
      <div className="flex flex-col justify-center items-center lg:justify-start lg:items-center">
        <div>
          
        </div>
      </div>
    </div>
  );
}

export default KontenSection;
