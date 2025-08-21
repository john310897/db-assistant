import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect } from "react"

type Inventory = {
    brand: string,
    category: string,
    color: string,
    current_price: number,
    customer_rating: number,
    is_returned: boolean,
    markdown_percentage: number,
    original_price: number,
    product_id: string,
    purchase_date: string,
    return_reason: number,
    season: string,
    size: string,
    stock_quantity: number
}
type TableComponentProps = {
    dataList: Inventory[]
}
type Fields = {
    fieldName: string,
    key: string
}
const fields: Fields[] = [
    { fieldName: 'Brand', key: 'brand' },
    { fieldName: 'category', key: 'category' },
    { fieldName: 'color', key: 'color' },
    { fieldName: 'current_price', key: 'current_price' },
    { fieldName: 'customer_rating', key: 'customer_rating' },
    { fieldName: 'is_returned', key: 'is_returned' },
    { fieldName: 'markdown_percentage', key: 'markdown_percentage' },
    { fieldName: 'original_price', key: 'original_price' },
    { fieldName: 'product_id', key: 'product_id' },
    { fieldName: 'purchase_date', key: 'purchase_date' },
    { fieldName: 'return_reason', key: 'return_reason' },
    { fieldName: 'season', key: 'season' },
    { fieldName: 'size', key: 'size' },
    { fieldName: 'stock_quantity', key: 'stock_quantity' }
]

const TableComponent = ({ dataList }: TableComponentProps) => {
    useEffect(() => {
        console.log('datalist', dataList)
    }, [dataList])
    return (
        <div className="table_component">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {fields?.map((field, index) => (
                                <TableCell key={index + '2'}><b>{field?.fieldName}</b></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList?.length > 0 && dataList?.map((row: any, index) => (
                            <TableRow
                                key={index + '_11'}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {fields?.map((field, index) => (
                                    <TableCell component="th" scope="row">
                                        {row[field?.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default TableComponent