"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signinSchema } from "@/schemas/signinSchema";
import ApiResponse from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignIn = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof signinSchema>>({
		resolver: zodResolver(signinSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signinSchema>) => {
		setIsSubmitting(true);
		try {
			const res = await axios.post("/api/sign-in", values);

			toast({
				title: "Success",
				description: res.data.message,
				duration: 3000,
			});
			router.push("/create");
		} catch (error) {
			console.log("Error in signin ", error);
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Signin failed.",
				description: errorMessage ?? "An error occurred while signin.",
				duration: 3000,
				variant: "destructive",
			});
		}
		setIsSubmitting(false);
	};

	return (
		<div className="flex justify-center items-start pt-32 min-h-screen">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-sm border shadow-gray-500">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight mb-6">
						Welcome to ShrinkIt
					</h1>
					<p className="mb-4">
						Sign in to manage and track your short URLs
						effortlessly.
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="you@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={isSubmitting}
							variant="secondary"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" />
									Please wait...
								</>
							) : (
								"Sign in"
							)}
						</Button>
					</form>
				</Form>
				<div className="mt-4 text-center">
					<p>
						Don't have an account yet?{" "}
						<Link
							href="/sign-up"
							className="text-blue-700 hover:text-blue-800 hover:underline duration-200"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
