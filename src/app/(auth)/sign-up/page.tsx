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
import { signupSchema } from "@/schemas/signupSchema";
import ApiResponse, { ErrorResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

const SignUp = () => {
	const [username, setUsername] = useState<string>("");
	const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const { toast } = useToast();
	const debounced = useDebounceCallback(setUsername, 500);

	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const validateUsername = async () => {
			if (username) {
				setIsLoading(true);
				setUsernameMessage(null);
				try {
					const res = await axios.get(
						`/api/check-username?username=${username}`
					);

					setUsernameMessage(res.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ErrorResponse>;
					let errorMessage = axiosError.response?.data.errorDetails;
					setUsernameMessage(errorMessage!);
				} finally {
					setIsLoading(false);
				}
			}
		};
		validateUsername();
	}, [username]);

	const onSubmit = async (values: z.infer<typeof signupSchema>) => {
		setIsSubmitting(true);
		try {
			const res = await axios.post("/api/sign-up", values);

			toast({
				title: "Success",
				description: res.data.message,
				duration: 3000,
			});
			router.push("/sign-in");
		} catch (error) {
			console.log("Error in signup ", error);
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Signup failed.",
				description: errorMessage ?? "An error occurred while signup.",
				duration: 3000,
				variant: "destructive",
			});
		}
		setIsSubmitting(false);
	};

	return (
		<div className="flex justify-center items-start pt-24 min-h-screen">
			<div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-sm border shadow-gray-500">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight mb-6">
						Sign up to ShrinkIt
					</h1>
					<p className="mb-4">
						Sign up to start shortening and managing your URLs.
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="your_username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value); // Assuming username uniqueness check
											}}
										/>
									</FormControl>
									{isLoading && (
										<Loader2 className="animate-spin"></Loader2>
									)}
									<p
										className={`text-sm ${
											usernameMessage ===
											"Username is unique."
												? "text-green-700"
												: "text-destructive"
										}`}
									>
										{usernameMessage}
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="your_email@example.com"
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
											placeholder="Create a strong password"
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
								"Sign up"
							)}
						</Button>
					</form>
				</Form>
				<div className="mt-4 text-center">
					<p>
						Already have an account?{" "}
						<Link
							href="/sign-in"
							className="text-blue-700 hover:text-blue-800 hover:underline duration-200"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
