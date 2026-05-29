import RegisterForm from "@/components/modules/Auth/RegisterForm";
import LogoWithTitle from "@/components/shared/LogoWithTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


export default function RegisterPage() {

	return (
		<div className="relative min-h-screen flex items-center justify-center px-4 py-4">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 -left-40 w-150 h-150 bg-violet-500/10 rounded-full blur-[100px]" />
				<div className="absolute bottom-0 -right-40 w-125 h-125 bg-indigo-500/10 rounded-full blur-[100px]" />
			</div>
			<LogoWithTitle />

			<div className="relative z-10 w-full max-w-md my-auto">

				<Card className="border border-white/5 bg-zinc-900/70 backdrop-blur-xl shadow-xl shadow-black/40">
					<CardHeader className="pt-4 pb-2 px-5 text-center space-y-1">
						<CardTitle className="text-2xl font-bold tracking-tight text-white">
							Create Account
						</CardTitle>
						<CardDescription className="text-zinc-400 text-xs">
							Register a new account to get started
						</CardDescription>
					</CardHeader>

					<CardContent className="px-5 pb-2">
						<RegisterForm />
					</CardContent>

					<CardFooter className="flex justify-center py-4">
						<Link href="/login" className="w-full">
							<p className="text-center text-zinc-400 hover:text-white transition-colors">
								Already have an account?{" "}
								<span className="text-violet-400 font-medium hover:underline">
									Login now
								</span>
							</p>
						</Link>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}