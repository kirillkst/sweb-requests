import React, { useEffect, useState, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import useRequestsService from "../services/requestsService";

import Row from "./Row";
import SkeletonRow from "./SkeletonRow";

import { PROCESS_STATE } from "../utils/constants";


const App = () => {
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [maxPage, setMaxPage] = useState(0);
	const { process, setProcess, getRequests } = useRequestsService();
	const { deleteRequest } = useRequestsService();

	const handlerDeleteRow = (id) => {
		if (window.confirm('Удалить заявку?')) {
			deleteRequest(id)
				.then(res => {
					if (res) {
						if (data.length == 1 && currentPage > 1)
							setCurrentPage(currentPage-1);
						else
							getItems();
					}
				})
				.catch();
		}
	}

	const getItems = async () => {
		const res = await getRequests(currentPage);
		setData(res.items);
		setMaxPage(res.maxPage)
		setProcess(PROCESS_STATE.CONFIRMED);
	}

	useEffect(() => {
		getItems();
		window.scrollTo({top: 0});
	}, [currentPage]);

	if ( process === PROCESS_STATE.ERROR )
		return 'Ошибка';

	return (
		<div className="mt-5 mb-20">
			<div className="overflow-x-auto relative shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" className="py-3 pl-4 pr-2">ID</th>
							<th scope="col" className="py-3 px-2">Имя</th>
							<th scope="col" className="py-3 px-2">Телефон</th>
							<th scope="col" className="py-3 px-2">Дополнительно</th>
							<th scope="col" className="py-3 pl-2 pr-4">Дата</th>
							<th scope="col" className="px-2"></th>
						</tr>
					</thead>
					<tbody>
						{process === PROCESS_STATE.CONFIRMED
							? data.map((el) => <Row key={el.id} deleteRow={handlerDeleteRow} {...el} />)
							: [...new Array(10)].map((_, index) => <SkeletonRow key={index} />)
						}
					</tbody>
				</table>
			</div>
			{(maxPage > 1) && (
				<nav className="mt-10">
					<ReactPaginate
						forcePage={currentPage-1}
						breakLabel="..."
						nextLabel=">"
						onPageChange={(e) => setCurrentPage(e.selected + 1)}
						pageRangeDisplayed={10}
						pageCount={maxPage}
						previousLabel="<"
						renderOnZeroPageCount={null}
						pageClassName="text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
						pageLinkClassName="block px-3 py-2 leading-tight "
						previousClassName="text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
						previousLinkClassName="block px-3 py-2 ml-0 leading-tight"
						nextClassName="text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
						nextLinkClassName="block px-3 py-2 leading-tight"
						breakClassName="px-3"
						containerClassName="inline-flex items-center -space-x-px"
						activeLinkClassName="z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
					/>
				</nav>
			)}
		</div>
	)
};

export default App;
