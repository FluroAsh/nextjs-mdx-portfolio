import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A collection of my photography from my travels.",
};

export default function PhotographyPage() {
  return (
    <div className="grid place-items-center">
      <div className="**:text-center">
        <h1 className="text-2xl">Gallery</h1>
        <p className="text-lg">Coming soon!</p>
      </div>
    </div>
  );
}
