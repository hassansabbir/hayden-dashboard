import type { Metadata } from "next";
import SignIn from "./SignIn";

export const metadata: Metadata = {
  title: "Sign In | Tee-It-Up Admin",
};

export default function SignInPage() {
  return <SignIn />;
}
