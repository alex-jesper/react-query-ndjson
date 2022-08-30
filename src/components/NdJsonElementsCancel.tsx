import { FC, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useElementsUpdateCancel } from '../api/Api';

export const NdJsonElementsCancel: FC = () => {
    const { result, abort } = useElementsUpdateCancel()
    const data = result.data

    useEffect(() => {
        console.log("Is initially aborted: " + abort.signal.aborted)
        return () => {
            console.log("Unmounted: " + abort.signal.aborted)
            abort.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box>
            <Typography variant='h4'>Streamed ndjson Elements:</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sequence Number</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((value) => {
                            return (
                                <TableRow key={value.timestamp}>
                                    <TableCell>
                                        {value.seqNo}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(value.timestamp).toISOString()}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default NdJsonElementsCancel