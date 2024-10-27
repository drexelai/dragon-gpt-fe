import { TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { HybridTooltip, HybridTooltipContent, HybridTooltipTrigger, TouchProvider } from "./ui/TouchProvider";

const CustomTooltip = () => {
	return (
		<TouchProvider>
			<TooltipProvider delayDuration={250}>
				<HybridTooltip>
					<HybridTooltipTrigger>
						<Info />
					</HybridTooltipTrigger>
					<HybridTooltipContent className="max-w-80 bg-black/70 border-none backdrop-filter backdrop-blur-sm text-white dark:bg-white dark:text-black" side="bottom">
						Ask DragonGPT any of your Drexel related questions and get a response
						in seconds
					</HybridTooltipContent>
				</HybridTooltip>
			</TooltipProvider>
		</TouchProvider>
	);
};

export default CustomTooltip;
