import { BrandLogo } from "@/components/BrandLogo";
import { SignedIn, SignedOut, SignIn, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex py-6 w-full z-10 fixed top-0 bg-background/95 shadow-lg">
      <nav className="flex gap-10 font-semibold items-center container">
        <Link href="/" className="mr-auto ">
          <BrandLogo />
        </Link>
        <Link href="#" className="text-lg">
          Features
        </Link>
        <Link href="/#pricing" className="text-lg">
          Pricing
        </Link>
        <Link href="#" className="text-lg">
          About
        </Link>
        <span>
          <SignedIn>
            <Link href="/">Dashboad</Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>Login</SignInButton>
          </SignedOut>
        </span>
      </nav>
    </header>
  );
}
