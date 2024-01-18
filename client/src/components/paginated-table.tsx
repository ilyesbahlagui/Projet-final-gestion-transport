import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Pagination, Stack, Table } from "react-bootstrap";

export interface PaginatedTableProps<T>
{
	totalItems: number,
	itemsPerPage?: number,
	getItems: (page: number) => T[],
	renderItem: (item: T, index: number) => ReactElement,
	header: ReactElement,
    hidePagination?: boolean,
    ifEmpty?: ReactNode,
}

export const PaginatedTable = <T extends unknown>(properties: PaginatedTableProps<T>) =>
{
	const [page, setPage] = useState(0);
	const [items, setItems] = useState(properties.getItems(page));

    const props = { hidePagination: false, ...properties };

	useEffect(() => setItems(properties.getItems(page)), [page, properties]);

    if (!props.totalItems && props.ifEmpty) {
        return typeof props.ifEmpty === "string"
            ? (<div className="mb-4 text-center"><span className="mb-4 fst-italic">{ props.ifEmpty }</span></div>)
            : props.ifEmpty as JSX.Element;
    }

    const lastPageNum = Math.ceil(props.totalItems / (props.itemsPerPage ?? props.totalItems));

    const setFirstPage = () => setPage(0);
    const setPrevPage = () => setPage((page) => page - 1 < 0 ? 0 : page - 1);
    const setNextPage = () => setPage((page) => page + 1 > lastPageNum - 1 ? lastPageNum - 1 : page + 1);
    const setLastPage = () => setPage(lastPageNum - 1);

	return (
		<Stack gap={1}>
			<Table striped bordered hover className="align-middle" responsive>
				<thead>{props.header}</thead>
				<tbody>{items.map((item, index) => props.renderItem(item, index))}</tbody>
			</Table>

			{ !props.hidePagination
                && <PaginatedButtons
                    first={setFirstPage}
                    prev={setPrevPage}
                    next={setNextPage}
                    last={setLastPage}
                    setPage={setPage}
                    totalPages={lastPageNum}
                    currentPage={page} />
            }
		</Stack>
	);
};

interface PaginatedButtonsProps
{
    totalPages: number,
    currentPage: number,
	first: () => void,
	prev: () => void,
	next: () => void,
	last: () => void,
    setPage: (page: number) => void,
}

const PaginatedButtons = (props: PaginatedButtonsProps) =>
(
	<Pagination className="d-flex justify-content-end pe-2">
		<Pagination.First onClick={props.first} disabled={ props.currentPage <= 0 } />
		<Pagination.Prev onClick={props.prev} disabled={ props.currentPage <= 0 } />
			{ [...Array(props.totalPages ?? 1).keys()].map((pageNum: number) => {
				return (
					<Pagination.Item key={ pageNum } active={ pageNum === props.currentPage } onClick={ () => props.setPage(pageNum) }>
						{pageNum + 1}
					</Pagination.Item>
				);
			}) }
		<Pagination.Next onClick={props.next} disabled={ props.currentPage >= props.totalPages - 1 }/>
		<Pagination.Last onClick={props.last} disabled={ props.currentPage >= props.totalPages - 1 }/>
	</Pagination>
);
