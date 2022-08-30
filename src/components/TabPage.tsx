import { FC } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ClassicElements from './ClassicElements';
import React from 'react';
import NdJsonElements from './NdJsonElements';
import NdJsonElementsUpdate from './NdJsonElementsUpdate';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const TabPage: FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Box>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Home" />
                    <Tab label="Classic" />
                    <Tab label="NDJSON" />
                    <Tab label="NDJSON UPDATE" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Home sweet home
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ClassicElements />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <NdJsonElements />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <NdJsonElementsUpdate />
            </TabPanel>
        </Box>
    )
}

export default TabPage