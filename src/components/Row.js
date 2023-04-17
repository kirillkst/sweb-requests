import React from 'react';

const Row = ({ id, name, phone, company, selected_company, additional, date, deleteRow }) => {
	return (
		<tr className="bg-white border-b hover:bg-gray-50">
			<td className="py-2 pl-4 pr-2 max-w-sm">{id}</td>
			<td className="py-2 px-2 max-w-sm">{name}</td>
			<td className="py-2 px-2 max-w-sm whitespace-nowrap">{phone}</td>
			<td className="py-2 px-2 text-xs max-w-sm md:w-1/3">
				<ul className="">
					{Object.entries(additional).map(([key, value]) => (
						<li>
							{key}: {value}
						</li>
					))}
				</ul>
			</td>
			<td className="py-2 pl-2 pr-4 max-w-sm">
				{new Date(date).toLocaleDateString()}
				<br />
				{new Date(date).toLocaleTimeString()}
			</td>
			<td className="px-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 14 14"
					width={10}
					className="mx-auto cursor-pointer hover:fill-red-500"
					onClick={() => deleteRow(id)}
				>
					<path d="M13.8,12.7c0.3,0.3,0.3,0.8,0,1c-0.1,0.1-0.3,0.2-0.5,0.2c-0.2,0-0.4-0.1-0.5-0.2L7,8l-5.7,5.7
					C1.1,13.9,0.9,14,0.7,14s-0.4-0.1-0.5-0.2c-0.3-0.3-0.3-0.8,0-1L6,7L0.2,1.3c-0.3-0.3-0.3-0.8,0-1s0.8-0.3,1,0L7,6l5.7-5.7
					c0.3-0.3,0.8-0.3,1,0c0.3,0.3,0.3,0.8,0,1L8,7L13.8,12.7z"/>
				</svg>
			</td>
		</tr>
	);
};

export default Row;
