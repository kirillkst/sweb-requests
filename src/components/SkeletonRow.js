import React from 'react';

const SkeletonRow = () => {
	return (
		<tr className="bg-white border-b animate-pulse">
            {[...new Array(6)].map((_, index) => (
                <td className="p-2 max-w-sm h-16" key={index}><div className="bg-gray-200 h-4 rounded"></div></td>
            ))}
		</tr>
	);
};

export default SkeletonRow;
