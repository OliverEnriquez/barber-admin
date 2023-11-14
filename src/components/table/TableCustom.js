

import React from 'react';
import { Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const TableCustom = ({ data, headers, onEdit, onDelete }) => {
    const renderTableHeaders = () => {
        if (!headers || headers.length === 0) {
            // If no custom headers provided, use keys from the first object in data
            return Object.keys(data[0]).map((key) => <th key={key}>{key}</th>);
        }

        return headers.map((header) => <th key={header}>{header}</th>);
    };

    const renderTableRows = () => {
        if (!data || data.length === 0) {
            return (
                <tr>
                    <td colSpan="100%">No data available</td>
                </tr>
            );
        }

        return data.map((row, index) => (
            <tr key={index}>
                {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                ))}
                <td>
                    <Button variant='success' onClick={() => onEdit(row)}>Editar</Button>
                </td>
                <td><Button variant='danger' onClick={() => onDelete(row)}>Eliminar</Button></td>
            </tr>
        ));
    };

    return (
        <div className="table-responsive">
            <Table>
                <thead className="text-primary">
                    <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
            </Table>
        </div>
    );
};

export default TableCustom;