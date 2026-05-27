import LoginForm from "@/components/modules/Auth/LoginForm";
import LogoWithTitle from "@/components/shared/LogoWithTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


export default async function LoginPage({
	searchParams,
}: {
	searchParams?: Promise<{ redirect?: string }>;
}) {
	const params = (await searchParams) || {};

	return (
		<div className="relative min-h-screen flex items-center justify-center px-4 py-6">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 -left-40 w-125 h-125 bg-violet-500/10 rounded-full blur-[100px]" />
				<div className="absolute bottom-0 -right-40 w-125 h-125 bg-indigo-500/10 rounded-full blur-[100px]" />
			</div>
			<LogoWithTitle />

			<div className="relative z-10 w-full max-w-sm">

				<Card className="mt-5 border border-white/5 bg-zinc-900/70 backdrop-blur-xl shadow-xl shadow-black/40">
					<CardHeader className="pt-5 pb-4 px-5 text-center space-y-1">
						<CardTitle className="text-2xl font-bold tracking-tight text-white">
							Welcome back
						</CardTitle>
						<CardDescription className="text-zinc-400 text-xs">
							Sign in to continue to your dashboard
						</CardDescription>
					</CardHeader>

					<CardContent className="px-5 pb-2">
						<LoginForm redirectPath={params?.redirect} />
					</CardContent>

					<CardFooter className="flex justify-center py-4"> 
						<Link href="/register" className="w-full">
							<p className="text-center text-zinc-400 hover:text-white transition-colors">
								Don&apos;t have an account?{" "}
								<span className="text-violet-400 font-medium hover:underline">
									Create one
								</span>
							</p>
						</Link>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}