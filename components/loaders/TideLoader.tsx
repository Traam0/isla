import { secondsInDay } from "date-fns";
import { classNames } from "~/utils/classNames";

export function TideWaveLoader(): JSX.Element {
	return (
		<section
			role="article"
			className="w-[600px] py-2 bg-background-500 flex flex-row items-start border border-secondary-200 animate-pulse"
		>
			<section className="px-2">
				<div className="h-12 w-12 rounded-full bg-primary-500" />
			</section>
			<div className="w-full flex flex-col items-start justify-start gap-2 px-4">
				<div className="flex justify-start items-baseline gap-3">
					<h2 className="font-semibold tracking-wide text-lg w-[7ch] bg-slate-700"></h2>{" "}
					<span className="text-gray-500 text-xs w-[13ch] bg-slate-600"></span>
				</div>
				<div className="space-y-1 w-full">
					<p className="w-11/12  min-h-4 h-4 bg-gray-300 rounded-2xl" />
					<p className="w-9/12  min-h-4 h-4 bg-gray-300 rounded-2xl" />
					<p className="w-full  min-h-4 h-4 bg-gray-300 rounded-2xl" />
				</div>
				<aside
					// width={400}
					// height={510}
					className={classNames(
						"h-[230px] w-full",
						"max-w-full max-h-[510px] bg-secondary-600 rounded-md"
					)}
				/>
			</div>
		</section>
	);
}
