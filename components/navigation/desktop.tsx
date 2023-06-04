import {
	IconBookmark,
	IconBrandAppgallery,
	IconHome2,
	IconLogin,
	IconLogout2,
	IconMessage,
	IconNotification,
	IconPhoto,
	IconSettings,
	IconUser,
	TablerIconsProps,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "~/hooks";

interface DesktopNavigationProps {
	className?: string;
}

interface NavigationItem {
	icon: (props: TablerIconsProps) => JSX.Element;
	uri: string;
	label: string;
	disabled: boolean;
}

const navigationItems: NavigationItem[] = [
	{ icon: IconHome2, uri: "/home", label: "Home", disabled: false },
	{
		icon: IconNotification,
		uri: "/notifications",
		label: "notifications",
		disabled: false,
	},
	{ icon: IconMessage, uri: "/messages", label: "messages", disabled: false },
	{ icon: IconBookmark, uri: "/saved", label: "BookMarks", disabled: false },
	{ icon: IconPhoto, uri: "/Gallery", label: "gallery", disabled: false },
];

const subNavigationItems: NavigationItem[] = [
	{ icon: IconSettings, uri: "/settings", label: "settings", disabled: false },
	{ icon: IconUser, uri: "/profile", label: "Profile", disabled: false },
	{
		icon: IconLogout2,
		uri: "/api/auth/logout",
		label: "logout",
		disabled: false,
	},
];

export function DesktopNavigation({}: DesktopNavigationProps): JSX.Element {
	const { data: session, ...sessionRest } = useSession();
	return (
		<header className="min-w-[400px]  h-screen flex flex-col justify-start items-end">
			<nav className="w-64 h-full flex flex-col justify-between py-20 w-fit">
				<div className="flex flex-col items-start justify-start gap-3 text-2xl">
					{navigationItems.map((item, index) => (
						<div className="px-8 " key={index}>
							<Link
								href={item.uri}
								className="flex gap-2 py-2 px-4 items-center group justify-start font-medium capitalize hover:bg-primary-500 rounded-xl"
							>
								<item.icon stroke={1.25} size={36} className="group-hover:text-accent-500"/>
								{item.label}
							</Link>
						</div>
					))}
				</div>
				<div className="flex flex-col items-start justify-start gap-2 text-xl">
					{session ? (
						subNavigationItems.map((item, index) => (
							<div className="px-12" key={index}>
								<Link
									href={item.uri}
									className="flex gap-2 items-center justify-start font-medium"
								>
									<item.icon stroke={1.25} size={32} />
									{item.label}
								</Link>
							</div>
						))
					) : (
						<div className="px-12">
							<Link
								href={"/auth/login"}
								className="flex gap-2 items-center justify-start font-semibold"
							>
								<IconLogin stroke={1.5} size={32} />
								Login
							</Link>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
}
