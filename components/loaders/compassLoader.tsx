import { classNames } from "~/utils/classNames";

interface CompassLoaderProps {
	size?: number;
	background?: string;
	color?: string;
}

export function CompassLoader({
	size,
	background,
	color,
}: CompassLoaderProps): JSX.Element {
	return (
		<div
			className={classNames(
				"compass-loader box-content shadow-sm animate-compass ",
				"w-16 h-16 relative bg-slate-50 rounded-full rotate-45",
				"before:absolute before:content-[''] before:top-1/2 before:left-1/2 before:w-[15px] before:h-[30px] before:bg-accent-500 before:skew-x-[5deg] before:skew-y-[60deg] before:-translate-x-1/2 before:translate-y-[-50%] ",
				"after:absolute after:content-[''] after:top-1/2 after:left-1/2 after:w-[6px] after:h-[6px] after:rounded-full after:bg-white after:-translate-x-1/2 after:-translate-y-1/2"
			)}
		></div>
	);
}

/* 
    .loader:before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 15px;
      height: 30px;
      background: #FF3D00;
      transform: skew(5deg , 60deg) translate(-50%, -5%);
    }

    .loader:after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #FFF;
      transform:translate(-50% , -50%);
    }

    @keyframes rotate {
      0% { transform: rotate(45deg)}
      30% , 50% , 70%  { transform: rotate(230deg)}
      40% , 60% , 80% { transform: rotate(240deg)}
      100% {  transform: rotate(245deg)}
   }
   */
