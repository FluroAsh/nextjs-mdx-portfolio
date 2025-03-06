import { paths } from "@/config/paths";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center font-semibold">
      <div>
        <Image
          src="/static/images/poor-milhouse.gif"
          className="absolute inset-0 z-[-1] h-full w-full object-cover brightness-50"
          height={480}
          width={274}
          alt="Ralph Wiggum from The Simpsons on a bus, chuckling."
        />
      </div>

      <h1 className="text-[112px] leading-none tracking-wider">404</h1>
      <p className="pb-4">There&apos;s nothing here. Except Milhouse.</p>

      <p className="text-lg">Let&apos;s get you back on track.</p>
      <Link
        className="text-lg font-semibold text-green-500 transition-colors duration-75 hover:text-green-600"
        href={paths.home.pathname}
        replace
      >
        Go to Home
      </Link>
    </div>
  );
}
