interface SubAppLayoutProps {
	children: JSX.Element;
}

export function SubAppLayout({ children }: SubAppLayoutProps): JSX.Element {
	return (
		<div className="w-full flex h-screen bg-slate-50">
			{children}
			<div className="relative h-screen overflow-hidden bg-red-100">sddsd</div>
		</div>
	);
}
