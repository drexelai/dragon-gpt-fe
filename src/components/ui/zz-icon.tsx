import * as React from "react";

// By: tabler
// See: https://v0.app/icon/tabler/zzz
// Example: <IconTablerZzz width="24px" height="24px" style={{color: "#000000"}} />

const ZzIcon = ({
	height = "1em",
	strokeWidth = "2",
	fill = "none",
	focusable = "false",
	...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
	<svg
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		height={height}
		focusable={focusable}
		{...props}
	>
		<path
			fill={fill}
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={strokeWidth}
			d="M4 12h6l-6 8h6m4-16h6l-6 8h6"
		/>
	</svg>
);

export default ZzIcon;
