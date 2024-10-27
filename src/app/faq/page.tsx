"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import DragonGPTLogo from "../../public/dragongptblue.png";

export default function FAQ() {
  const router = useRouter();

  return (
    <div className="p-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 w-full flex justify-center">
      <div className="flex flex-col items-center text-center">
        <Image
          src={DragonGPTLogo} // image in /public/dragon.png
          alt="DragonGPT Logo"
          width={200}
          height={200}
        />{" "}
        <br></br>
        <h1 className="text-4xl px-4 font-bold mb-4">About DragonGPT</h1>
        <p className="text-lg max-w-2xl">
          DragonGPT is your personal AI-powered academic guide for all things
          Drexel. Using advanced retrieval-augmented generation, it delivers
          accurate, fast answers to any question about university data. Whether
          you&apos;re looking for course information, academic deadlines, or
          recommendations for next term&apos;s classes, DragonGPT provides
          personalized, real-time support—just like a well-informed academic
          advisor, but available 24/7.
        </p>
        <br></br>
        <p className="text-lg max-w-2xl">
          Currently, the app is in its alpha testing phase. Please email{" "}
          <a href="mailto:az548@drexel.edu">az548@drexel.edu</a> if you
          encounter any issues while using the application.
        </p>
        <br></br>
        <br></br>
        {/* Pass the function as a callback */}
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700"
          onClick={() => router.push("/")}
        >
          Go back to DragonGPT
        </button>
      </div>
    </div>
  );
}
