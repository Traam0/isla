import { Listbox, Combobox, Transition } from "@headlessui/react";
import { IconCheck, IconGlobe, IconSelector } from "@tabler/icons-react";
import { Fragment } from "react";
import { classNames } from "~/utils/classNames";

interface selectProps {
	options: string[];
	placeHolder?: string;
	label?: string;
	className?: string;
	position?: "TOP" | "BOTTOM";
	onChange?: any;
	selected: string;
	value: string;
}

interface SuperSelectProps {
	label?: string;
	onChange: () => void;
	description?: string;
	searchable: boolean;
	options: string[];
	position: "TOP" | "BOTTOM";
	selected: string;
	value: string;
	className?: string;
}

export function Select({
	options,
	label,
	selected,
	position = "BOTTOM",
	...props
}: selectProps) {
	return (
		<div className="w-full md:min-w-fit  flex-grow">
			<Listbox value={selected} onChange={props.onChange}>
				{({ open }) => (
					<>
						{label && (
							<Listbox.Label className="block text-sm font-medium text-gray-700">
								{label}
							</Listbox.Label>
						)}
						<div className="mt-[0.6rem] relative">
							<Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent  sm:text-sm">
								<span className="block truncate py-[3px] uppercase">
									{selected}
								</span>
								<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
									<IconSelector
										className="h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
								</span>
							</Listbox.Button>

							<Transition
								show={open}
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options
									className={classNames(
										position === "TOP"
											? "-top-1 -translate-y-[100%] "
											: "bottom-1 mt-1",
										"absolute z-10 w-full bg-background-500 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border-gray-300 scrollbar-thin "
									)}
								>
									{options.map((option, index) => (
										<Listbox.Option
											key={index}
											className={({ active, selected }) =>
												classNames(
													selected
														? "bg-primary-500"
														: active
														? "bg-secondary-500"
														: "bg-inherit",
													"cursor-default select-none relative py-2 pl-3 pr-9 text-dark-500"
												)
											}
											value={option}
										>
											{({ selected, active }) => (
												<>
													<span
														className={classNames(
															selected ? "font-semibold" : "font-normal",
															"block truncate uppercase"
														)}
													>
														{option}
													</span>

													{selected ? (
														<span
															className={classNames(
																active ? "text-dark-500" : "text-accent-500",
																"absolute inset-y-0 right-0 flex items-center pr-4"
															)}
														>
															<IconCheck
																className="h-5 w-5"
																aria-hidden="true"
															/>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</>
				)}
			</Listbox>
		</div>
	);
}

export function SuperSelect({ searchable }: SuperSelectProps): JSX.Element {
	if (searchable) {
		return <Combobox></Combobox>;
	}

	return <Listbox></Listbox>;
}
