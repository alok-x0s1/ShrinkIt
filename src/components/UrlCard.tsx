import { CopyIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "./ui/card";
import {
	CornerDownRight,
	EllipsisVertical,
	FileSymlink,
	MousePointer2,
	ScanQrCode,
	Timer,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LinkType } from "@/models/linkModel";

const UrlCard = ({ link }: { link: LinkType }) => {
	const { toast } = useToast();
	const router = useRouter();

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(link.shortUrl);

		toast({
			title: "Short URL copied to clipboard",
			description: "You can now paste it wherever you want",
			duration: 3000,
		});
	};

	return (
		<Card className="w-full relative max-w-xl bg-background text-foreground border border-border hover:-translate-y-[2px] duration-300">
			<div className="absolute -top-5 -right-12 bg-foreground text-background p-1 rounded-sm">
				<div className="flex gap-1 items-center">
					<Timer className="w-4 h-4" />
					<p className="text-sm">{link.clickLimit} clicks</p>
				</div>
			</div>

			<CardContent className="flex items-center gap-3 p-2">
				<div className="flex items-center space-x-2 w-fit">
					<div className="border border-border rounded-full p-2 shadow-lg">
						<FileSymlink className="h-5 w-5" />
					</div>
				</div>
				<div className="flex flex-col w-full gap-1">
					<div className="flex gap-6 items-end">
						<p className="font-medium">
							{link.shortUrl.split(":3000/")[1]}
						</p>
						<div className="flex gap-3 items-center">
							<div className="border border-gray-500 p-[7px] shadow-md rounded-full hover:-translate-y-[1px] duration-300">
								<CopyIcon
									className="w-4 h-4 cursor-pointer"
									onClick={handleCopyToClipboard}
								/>
							</div>
							<div className="p-1 text-sm border border-gray-500 shadow-sm flex gap-1 rounded-sm items-center ml-2 hover:bg-accent cursor-default hover:text-accent-foreground">
								<MousePointer2 className="w-4 h-4" /> clicks {link.clickCount}
							</div>
						</div>
					</div>

					<div>
						<p className="text-sm text-gray-500 truncate flex gap-1 items-center mt-1">
							<div>
								<CornerDownRight className="w-4 h-4" />
							</div>
							<Link href={link.originalUrl} target="_blank">
								{link.originalUrl.split("://")[1].slice(0, 40)}
								...
							</Link>
						</p>
					</div>
				</div>

				<div
					className="w-fit cursor-pointer"
					title="Click to view analytics"
					onClick={() => {
						router.push(`/link/${link._id}`);
					}}
				>
					<EllipsisVertical />
				</div>
			</CardContent>
		</Card>
	);
};

export default UrlCard;
