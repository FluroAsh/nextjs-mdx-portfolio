import { paths } from "@/config/paths";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center font-semibold">
      <div>
        <Image
          src="/static/images/poor-milhouse.gif"
          className="absolute inset-0 w-full h-full -z-10 opacity-50 object-cover"
          height={480}
          width={274}
          alt="Ralph Wiggum from The Simpsons on a bus, chuckling."
        />
      </div>

      <h1 className="text-[112px] tracking-wider leading-none">404</h1>
      <p className="pb-4">There&apos;s nothing here. Except Milhouse.</p>

      <p className="text-lg">Let&apos;s get you back on track.</p>
      <Link
        className="font-semibold text-lg text-green-500 hover:text-green-600 transition-colors duration-75"
        href={paths.home.getPathname()}
        replace
      >
        Go to Home
      </Link>
    </div>
  );
}
