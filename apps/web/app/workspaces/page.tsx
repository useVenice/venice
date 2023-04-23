/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
'use client'

import '../global.css'

import { useState } from 'react';
import {
    BadgeDelta,
    Card,
    DeltaType,
    Dropdown,
    DropdownItem,
    MultiSelectBox,
    MultiSelectBoxItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from '@tremor/react';

export type SalesPerson = {
  name: string;
  leads: number;
  sales: string;
  quota: string;
  variance: string;
  region: string;
  status: string;
  deltaType: DeltaType;
};

export const salesPeople: SalesPerson[] = [
    {
        name: 'Peter Doe',
        leads: 45,
        sales: '1,000,000',
        quota: '1,200,000',
        variance: 'low',
        region: 'Region A',
        status: 'overperforming',
        deltaType: 'moderateIncrease',
    },
    {
        name: 'Lena Whitehouse',
        leads: 35,
        sales: '900,000',
        quota: '1,000,000',
        variance: 'low',
        region: 'Region B',
        status: 'average',
        deltaType: 'unchanged',
    },
    {
        name: 'Phil Less',
        leads: 52,
        sales: '930,000',
        quota: '1,000,000',
        variance: 'medium',
        region: 'Region C',
        status: 'underperforming',
        deltaType: 'moderateDecrease',
    },
    {
        name: 'John Camper',
        leads: 22,
        sales: '390,000',
        quota: '250,000',
        variance: 'low',
        region: 'Region A',
        status: 'overperforming',
        deltaType: 'increase',
    },
    {
        name: 'Max Balmoore',
        leads: 49,
        sales: '860,000',
        quota: '750,000',
        variance: 'low',
        region: 'Region B',
        status: 'overperforming',
        deltaType: 'increase',
    },
    {
        name: 'Peter Moore',
        leads: 82,
        sales: '1,460,000',
        quota: '1,500,000',
        variance: 'low',
        region: 'Region A',
        status: 'average',
        deltaType: 'unchanged',
    },
    {
        name: 'Joe Sachs',
        leads: 49,
        sales: '1,230,000',
        quota: '1,800,000',
        variance: 'medium',
        region: 'Region B',
        status: 'underperforming',
        deltaType: 'moderateDecrease',
    },
];

export default function TableView() {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedNames, setSelectedNames] = useState<string[]>([]);

    const isSalesPersonSelected = (salesPerson: SalesPerson) => (salesPerson.status === selectedStatus || selectedStatus === 'all')
    && (selectedNames.includes(salesPerson.name) || selectedNames.length === 0);

    return (
        <Card>
            <div className="sm:mt-6 hidden sm:flex sm:start sm:space-x-2">
                <MultiSelectBox
                    onValueChange={ (value) => setSelectedNames(value) }
                    placeholder="Select Salespeople"
                    className="max-w-xs"
                >
                    { salesPeople.map((item) => (
                        <MultiSelectBoxItem
                            key={ item.name }
                            value={ item.name }
                            text={ item.name }
                        />
                    )) }
                </MultiSelectBox>
                <Dropdown
                    className="max-w-xs"
                    defaultValue="all"
                    onValueChange={ (value) => setSelectedStatus(value) }
                >
                    <DropdownItem value="all" text="All Performances" />
                    <DropdownItem value="overperforming" text="Overperforming" />
                    <DropdownItem value="average" text="Average" />
                    <DropdownItem value="underperforming" text="Underperforming" />
                </Dropdown>
            </div>
            <div className="mt-6 sm:hidden space-y-2 sm:space-y-0">
                <MultiSelectBox
                    onValueChange={ (value) => setSelectedNames(value) }
                    placeholder="Select Salespeople"
                    className="max-w-full"
                >
                    { salesPeople.map((item) => (
                        <MultiSelectBoxItem
                            key={ item.name }
                            value={ item.name }
                            text={ item.name }
                        />
                    )) }
                </MultiSelectBox>
                <Dropdown
                    className="max-w-full"
                    defaultValue="all"
                    onValueChange={ (value) => setSelectedStatus(value) }
                >
                    <DropdownItem value="all" text="All Performances" />
                    <DropdownItem value="overperforming" text="Overperforming" />
                    <DropdownItem value="average" text="Average" />
                    <DropdownItem value="underperforming" text="Underperforming" />
                </Dropdown>
            </div>

            <Table className="mt-6">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell className="text-right">Leads</TableHeaderCell>
                        <TableHeaderCell className="text-right">
                            Sales ($)
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right">
                            Quota ($)
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right">
                            Variance
                        </TableHeaderCell>
                        <TableHeaderCell className="text-right">Region</TableHeaderCell>
                        <TableHeaderCell className="text-right">Status</TableHeaderCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    { salesPeople
                        .filter((item) => isSalesPersonSelected(item))
                        .map((item) => (
                            <TableRow key={ item.name }>
                                <TableCell>{ item.name }</TableCell>
                                <TableCell className="text-right">{ item.leads }</TableCell>
                                <TableCell className="text-right">{ item.sales }</TableCell>
                                <TableCell className="text-right">{ item.quota }</TableCell>
                                <TableCell className="text-right">
                                    { item.variance }
                                </TableCell>
                                <TableCell className="text-right">{ item.region }</TableCell>
                                <TableCell className="text-right">
                                    <BadgeDelta deltaType={ item.deltaType } size="xs">
                                        { item.status }
                                    </BadgeDelta>
                                </TableCell>
                            </TableRow>
                        )) }
                </TableBody>
            </Table>
        </Card>
    );
}
