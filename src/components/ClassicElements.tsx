import { FC } from 'react'
import { useQuery } from 'react-query'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Row } from '../model/Row'
import Typography from '@mui/material/Typography';

export const ClassicElements: FC = () => {
    const { data } = useQuery('classic_elements', fetchElements)
    return (
        <div>
            <Typography variant="h4">
                Classic Elements:
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sequence Number</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((row: Row) => {
                            return (
                                <TableRow key={row.seqNo}>
                                    <TableCell>
                                        {row.seqNo}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(row.timestamp).toISOString()}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

async function fetchElements() {
    const res = await fetch('http://localhost:8080')
    return res.json()
}

export default ClassicElements