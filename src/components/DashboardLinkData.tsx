import React, { useRef, useState } from "react";
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
	BellElectric,
	Calendar,
	CopyIcon,
	Download,
	DownloadCloud,
	FileJson2,
	Loader2,
	Lock,
	MonitorSmartphone,
	Share2,
	ShieldX,
	SquareMousePointer,
	Trash,
	User,
} from "lucide-react";
import { LinkType } from "@/models/linkModel";
import calculateDevice from "@/utils/calculateDevice";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import axios, { AxiosError } from "axios";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { ErrorResponse } from "@/types/ApiResponse";

const COLORS = [
	"#2a9d90",
	"#FFBB28",
	"#FF8042",
	"#d0ed57",
	"#8884D8",
	"#00C49F",
	"#ffc658",
	"#8dd1e1",
	"#82ca9d",
	"#a4de6c",
];

const DashboardLinkData = ({ linkData }: { linkData: LinkType }) => {
	const [timeRange, setTimeRange] = useState("all");
	const router = useRouter();
	const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	const filterDataByTimeRange = (data: any) => {
		if (timeRange === "all") return data;
		const now = new Date();
		const cutoff = new Date(
			timeRange === "week"
				? now.setDate(now.getDate() - 7)
				: now.setMonth(now.getMonth() - 1)
		);
		return data.filter((item: any) => new Date(item.clickDate) >= cutoff);
	};

	const prepareChartData = (key: string, top = 10) => {
		const data: { [key: string]: number } = {};
		filterDataByTimeRange(linkData.analytics).forEach((click: any) => {
			data[click[key]] = (data[click[key]] || 0) + 1;
		});
		return Object.entries(data)
			.sort((a, b) => b[1] - a[1])
			.slice(0, top)
			.map(([name, value]) => ({ name, value }));
	};

	const clicksByDateData = prepareChartData("clickDate");
	const deviceData = prepareChartData("device");
	const countryData = prepareChartData("country");
	const browserData = prepareChartData("browser");
	const regionData = prepareChartData("region");
	const cityData = prepareChartData("city");
	const referrerData = prepareChartData("referrer");

	const renderPieChart = (data: any, title: string) => (
		<Card className="col-span-1">
			<CardHeader>{title}</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) =>
								`${name} ${(percent * 100).toFixed(0)}%`
							}
						>
							{data.map((entry: any, index: number) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);

	const renderBarChart = (data: any, title: string, dataKey = "value") => (
		<Card className="col-span-2">
			<CardHeader>{title}</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Bar dataKey={dataKey} fill="#2a9d90" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);

	const device = calculateDevice(linkData.analytics);
	const { toast } = useToast();

	const handleDownloadQRCode = () => {
		if (downloadLinkRef.current && linkData.qrCode) {
			downloadLinkRef.current.href = linkData.qrCode;
			downloadLinkRef.current.download = "qrcode.png";
			downloadLinkRef.current.click();
		} else {
			toast({
				title: "Download failed",
				description: "QR code is unavailable",
				duration: 3000,
			});
		}
	};

	const handleShare = async () => {
		const shareData = {
			title: "Check out this link",
			text: "Here's a short link I generated for you:",
			url: linkData.shortUrl,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
				toast({
					title: "Shared successfully!",
					description: "Link was shared using Web Share API",
					duration: 3000,
				});
			} catch (err) {
				toast({
					title: "Sharing failed",
					description: "There was an issue sharing the link",
					duration: 3000,
				});
			}
		} else {
			toast({
				title: "Sharing not supported",
				description:
					"Your browser does not support Web Share API. Copy the link instead.",
				duration: 3000,
			});
			navigator.clipboard.writeText(linkData.shortUrl);
		}
	};

	return (
		<div className="flex flex-col gap-8 p-8 pt-32 pb-12 relative">
			<h1 className="text-2xl font-semibold">#link_id: {linkData._id}</h1>

			<div className="absolute top-32 right-6">
				<div className="flex gap-4">
					<Button
						onClick={() => {
							router.push(`/link/${linkData._id}/edit`);
						}}
					>
						Edit
					</Button>
					<DeleteButton id={linkData._id} />
					<Button
						className="bg-chart-3 text-white dark:hover:text-black"
						onClick={() => {
							router.push(`/dashboard`);
						}}
					>
						Dashboard
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap gap-4">
				<MetricCard
					icon={<SquareMousePointer />}
					title="Total Clicks"
					value={linkData.clickCount}
				/>

				<Card className="w-fit h-fit flex flex-col rounded-md px-4 py-2 bg-background hover:shadow-md transition-all duration-200 cursor-default">
					<CardContent className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<div>
								<FileJson2 />
							</div>
							<h2 className="text-xl font-bold">Short URL</h2>
							<div>
								<CopyIcon
									className="w-6 h-6 text-foreground/80 cursor-pointer hover:-translate-y-[1px] duration-300 ml-2"
									onClick={() => {
										navigator.clipboard.writeText(
											linkData.shortUrl
										);

										toast({
											title: "Copied to clipboard",
											description:
												"Short URL copied to clipboard",
											duration: 3000,
										});
									}}
								/>
							</div>
						</div>
						<p className="text-lg text-foreground/80 mt-1">
							{linkData.shortUrl.split("//")[1]}
						</p>
					</CardContent>
				</Card>

				<MetricCard
					icon={<ShieldX />}
					title="Click Limit"
					value={linkData.clickLimit}
				/>
				<MetricCard
					icon={<User />}
					title="Created By"
					value={linkData.createdBy.toString()}
				/>
				<MetricCard
					icon={<Calendar />}
					title="Expiration Date"
					value={formatDate(linkData.expirationDate.toString())}
				/>
				<MetricCard
					icon={<BellElectric />}
					title="Status"
					value={linkData.isActive ? "Active" : "Inactive"}
				/>
				<MetricCard
					icon={<Lock />}
					title="Password Protected"
					value={linkData.password ? "Yes" : "No"}
				/>

				<Card className="w-fit h-fit flex flex-col rounded-md px-4 py-2 bg-background hover:shadow-md transition-all duration-200 cursor-default">
					<CardContent className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<div>
								<MonitorSmartphone />
							</div>
							<h2 className="text-xl font-bold">Device</h2>
						</div>
						<p className="text-lg text-foreground/80 mt-1">
							Desktop: {device.desktop}
						</p>
						<p className="text-lg text-foreground/80">
							Mobile: {device.mobile}
						</p>
						<p className="text-lg text-foreground/80">
							Tablet: {device.tablet}
						</p>
					</CardContent>
				</Card>

				<MetricCard
					icon={<Calendar />}
					title="Created At"
					value={new Date(linkData.createdAt).toLocaleString()}
				/>

				<MetricCard
					icon={<Calendar />}
					title="Updated At"
					value={new Date(linkData.updatedAt).toLocaleString()}
				/>
			</div>

			<div className="flex gap-8 w-full mt-8">
				{linkData.qrCode ? (
					<div className="flex flex-col gap-4 border-r border-border pr-8">
						<img
							src={linkData.qrCode}
							alt="QR Code"
							className="w-56 border border-border rounded shadow-md"
						/>
						<div className="flex gap-2">
							<div
								className="cursor-pointer hover:bg-foreground/10 rounded-sm p-2 border border-border"
								onClick={handleDownloadQRCode}
							>
								<Download className="w-6 h-6" />
							</div>

							<div
								className="cursor-pointer hover:bg-foreground/10 rounded-sm p-2 border border-border"
								onClick={handleShare}
							>
								<Share2 className="w-6 h-6" />
							</div>

							<DeleteQRCode id={linkData._id} />
						</div>

						<a ref={downloadLinkRef} style={{ display: "none" }} />
					</div>
				) : (
					<div className="flex flex-col gap-4 border-r border-border pr-8">
						<div className="flex flex-col gap-2">
							<h2 className="text-xl font-bold">QR Code</h2>
							<p className="text-foreground/80 text-base">
								You haven't generated a QR code for this link
								yet. Click the button below to generate a QR
								code.
							</p>
						</div>
						<Button
							className="w-fit"
							onClick={() =>
								router.replace(`/generate-qr/${linkData._id}`)
							}
						>
							Generate QR Code
						</Button>
					</div>
				)}

				<div className="flex flex-col gap-4 w-3/4">
					{linkData.password ? (
						<div className="flex flex-col gap-2 max-w-lg">
							<h2 className="text-xl font-bold">
								Password Protected
							</h2>
							<p className="text-foreground/80 text-base">
								This link is password protected. You can change
								the password by clicking the button below.
							</p>
							<div className="flex gap-2">
								<Button
									className="w-fit"
									onClick={() =>
										router.replace(
											`/change-password/${linkData._id}`
										)
									}
								>
									Change Password
								</Button>

								<Button
									variant="destructive"
									className="w-fit"
									onClick={() => {
										router.replace(
											`/delete-password/${linkData._id}`
										);
									}}
								>
									Delete Password
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-2 max-w-lg">
							<h2 className="text-xl font-bold">
								Password Protected
							</h2>
							<p className="text-foreground/80 text-base">
								This link is not password protected. You can add
								a password by clicking the button below.
							</p>
							<Button
								className="w-fit"
								onClick={() =>
									router.replace(
										`/add-password/${linkData._id}`
									)
								}
							>
								Add Password
							</Button>
						</div>
					)}
				</div>
			</div>

			<Separator orientation="horizontal" className="w-full" />

			<div className="flex justify-end space-x-2">
				<button
					onClick={() => setTimeRange("all")}
					className={`px-4 py-2 rounded ${
						timeRange === "all"
							? "bg-chart-3 text-white"
							: "border border-border"
					}`}
				>
					All Time
				</button>
				<button
					onClick={() => setTimeRange("month")}
					className={`px-4 py-2 rounded ${
						timeRange === "month"
							? "bg-chart-3 text-white"
							: "border border-border"
					}`}
				>
					Last Month
				</button>
				<button
					onClick={() => setTimeRange("week")}
					className={`px-4 py-2 rounded ${
						timeRange === "week"
							? "bg-chart-3 text-white"
							: "border border-border"
					}`}
				>
					Last Week
				</button>
			</div>

			{linkData.analytics.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{renderBarChart(clicksByDateData, "Clicks by Date")}
					{renderBarChart(referrerData, "Top Referrers")}
					{renderPieChart(deviceData, "Clicks by Device")}
					{renderPieChart(browserData, "Clicks by Browser")}
					{renderPieChart(countryData, "Top Countries")}
					{renderPieChart(regionData, "Top Regions")}
					{renderPieChart(cityData, "Top Cities")}
				</div>
			) : (
				<div className="flex justify-center items-center">
					<p className="text-foreground/80 text-xl font-semibold">
						No analytics data yet
					</p>
				</div>
			)}

			<Card>
				<CardHeader>Analytics Details</CardHeader>
				<CardContent>
					<Table className="p-4">
						<TableCaption className="text-muted-foreground py-2">
							Analytics details for the link.
						</TableCaption>

						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>IP Address</TableHead>
								<TableHead>Country</TableHead>
								<TableHead>Region</TableHead>
								<TableHead>City</TableHead>
								<TableHead>Device</TableHead>
								<TableHead>Browser</TableHead>
								<TableHead className="text-right">
									Referrer
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filterDataByTimeRange(linkData.analytics).map(
								(click: any, index: number) => (
									<TableRow
										key={index}
										className={
											index % 2 === 0
												? "bg-background"
												: "bg-secondary"
										}
									>
										<TableCell className="font-medium">
											{formatDate(click.clickDate)}
										</TableCell>
										<TableCell>{click.ipAddress}</TableCell>
										<TableCell>{click.country}</TableCell>
										<TableCell>{click.region}</TableCell>
										<TableCell>{click.city}</TableCell>
										<TableCell>{click.device}</TableCell>
										<TableCell>{click.browser}</TableCell>
										<TableCell className="text-right">
											{click.referrer}
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};

const MetricCard = React.memo(
	({
		icon,
		title,
		value,
	}: {
		icon: React.ReactNode;
		title: string;
		value: string | number;
	}) => (
		<Card className="w-fit h-fit flex flex-col rounded-md px-4 py-2 bg-background hover:shadow-md transition-all duration-200 cursor-default">
			<CardContent className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<div>{icon}</div>
					<h2 className="text-xl font-bold">{title}</h2>
				</div>
				<p className="text-lg text-foreground/80 mt-1">{value}</p>
			</CardContent>
		</Card>
	)
);

export default DashboardLinkData;

const DeleteQRCode = ({ id }: { id: string }) => {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			const res = await axios.delete(`/api/generate-qr/${id}`);
			if (res.status === 200) {
				toast({
					title: "Success",
					description: "QR code deleted successfully",
					duration: 3000,
				});
				router.refresh();
				setTimeout(() => {
					setIsOpen(false);
				}, 1000);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			let errorMessage = axiosError.response?.data.errorDetails;
			toast({
				title: "Delete QR code failed.",
				description:
					errorMessage ??
					"An error occurred while deleting the QR code.",
				duration: 3000,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<div className="cursor-pointer hover:bg-destructive/80 rounded-sm p-2 border border-border">
					<Trash className="w-6 h-6" />
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your QR code.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							"Delete"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
