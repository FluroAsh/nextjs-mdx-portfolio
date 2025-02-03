import localFont from "next/font/local";

const catamaran = localFont({
  src: [
    {
      path: "./Catamaran-Medium.ttf",
      weight: "500",
    },
    {
      path: "./Catamaran-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "./Catamaran-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-catamaran",
});

const firaSans = localFont({
  src: [
    {
      path: "./FiraSans-Medium.ttf",
      weight: "500",
    },
    {
      path: "./FiraSans-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-fira-sans",
});

export { catamaran, firaSans };
