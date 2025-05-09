import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
    console.log("Layout");
  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
