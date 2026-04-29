import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex">
      {/* Left panel – login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Welcome back
          </h1>
          <LoginForm />
        </div>
      </div>

      {/* Right panel – brand */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-blue-600 p-12">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-4">ticktock</h2>
          <p className="text-blue-100 text-base leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
