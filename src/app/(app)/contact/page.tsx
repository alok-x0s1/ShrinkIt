"use client";
import { motion } from "framer-motion";
import { Link, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ErrorResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import {
	Form,
	FormField,
	FormItem,
	FormMessage,
	FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	name: z.string().min(3, { message: "At least 3 characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	message: z
		.string()
		.min(3, { message: "Message must be at least 3 characters" }),
});

function Contact() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const response = await axios.post("/api/feedback", data);

			toast({
				title: "Success",
				description: response.data.message,
				duration: 3000,
			});
			form.reset();
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			const axiosErrorMessage = axiosError.response?.data.message;
			toast({
				title: "Error",
				description:
					axiosErrorMessage || "An unexpected error occurred",
				variant: "destructive",
				duration: 3000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<h1 className="text-4xl font-bold text-center">Contact Us</h1>
				<p className="text-lg text-foreground/75 mt-2 text-center">
					Have any questions or feedback? Feel free to reach out to
					us.
				</p>

				<div className="flex flex-col border border-border p-4 rounded mt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex gap-2 items-center mb-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="w-1/2">
											<FormControl>
												<Input
													{...field}
													placeholder="Enter your name"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem className="w-1/2">
											<FormControl>
												<Input
													type="email"
													{...field}
													placeholder="Enter your email"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Enter your message"
												className="w-full"
												maxLength={1000}
												rows={4}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-col items-center justify-center mt-4">
								<Button disabled={isLoading} type="submit">
									{isLoading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<>
											<Link className="w-4 h-4 mr-2" />
											Contact Us
										</>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</motion.div>
		</div>
	);
}

export default Contact;
