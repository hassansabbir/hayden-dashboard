import type { Metadata } from "next";
import SignIn from "./SignIn";

export const metadata: Metadata = {
  title: "Sign In | Tea-It-Up Admin",
};

export default function SignInPage() {
  return <SignIn />;
}
