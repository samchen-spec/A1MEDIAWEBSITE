import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — A1 Media",
  description:
    "Join a fast-growing creator partnership agency. Open roles for video editors, setters, closers, sales managers, copywriters, and more.",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
