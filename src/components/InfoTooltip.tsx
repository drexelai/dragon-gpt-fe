import { TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
	HybridTooltip,
	HybridTooltipContent,
	HybridTooltipTrigger,
	TouchProvider,
} from "./ui/TouchProvider";

const CustomTooltip = () => {
	return (
		<TouchProvider>
			<TooltipProvider delayDuration={250}>
				<HybridTooltip>
					<HybridTooltipTrigger className="absolute right-0 py-2 px-4 md:relative md:right-[unset] md:py-0 md:px-0">
						<Info />
					</HybridTooltipTrigger>
					<HybridTooltipContent
						className="max-w-80 bg-black/70 border-none backdrop-filter backdrop-blur-sm text-white dark:bg-white dark:text-black"
						side="bottom"
					>
						Ask SAGE any of your Drexel related questions and get a response in
						seconds
					</HybridTooltipContent>
				</HybridTooltip>
			</TooltipProvider>
		</TouchProvider>
	);
};

export default CustomTooltip;
