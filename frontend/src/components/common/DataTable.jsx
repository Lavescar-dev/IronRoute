/**
 * DataTable Component
 *
 * A reusable table component with sorting, pagination, and search
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';

/**
 * DataTable Component
 *
 * @param {array} columns - Column definitions
 * @param {array} data - Table data
 * @param {boolean} loading - Loading state
 * @param {function} onExport - Export callback
 * @param {function} onRefresh - Refresh callback
 * @param {function} onRowClick - Row click callback
 * @param {string} emptyMessage - Message when no data
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  onExport,
  onRefresh,
  onRowClick,
  emptyMessage = 'Veri bulunamadı',
  searchable = true,
  exportable = true,
  pageSizes = [10, 25, 50, 100],
  defaultPageSize = 10,
}) => {
  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...(data || [])];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Sort
    if (orderBy) {
      result.sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string') {
          return order === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return order === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [data, searchTerm, orderBy, order, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  // Handlers
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format) => {
    if (onExport) {
      onExport(format, processedData);
    }
    handleExportClose();
  };

  // Render cell value
  const renderCellValue = (row, column) => {
    const value = row[column.field];

    // Custom render function
    if (column.renderCell) {
      return column.renderCell(row);
    }

    // Status chip
    if (column.type === 'status') {
      return (
        <Chip
          label={getStatusLabel(value)}
          color={getStatusColor(value)}
          size="small"
        />
      );
    }

    // Boolean
    if (column.type === 'boolean') {
      return (
        <Chip
          label={value ? 'Evet' : 'Hayır'}
          color={value ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      );
    }

    // Date
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('tr-TR');
    }

    // Currency
    if (column.type === 'currency' && value !== null) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(value);
    }

    // Default
    return value ?? '-';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Search */}
        {searchable && (
          <TextField
            size="small"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Yenile">
              <IconButton onClick={onRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {exportable && onExport && (
            <>
              <Tooltip title="Dışa Aktar">
                <IconButton onClick={handleExportClick}>
                  <FileDownloadIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={handleExportClose}
              >
                <MenuItem onClick={() => handleExport('excel')}>
                  <ListItemIcon>
                    <TableChartIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Excel (.xlsx)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport('csv')}>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>CSV</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleExport('pdf')}>
                  <ListItemIcon>
                    <PictureAsPdfIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>PDF</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    minWidth: column.minWidth,
                    width: column.width,
                  }}
                  sortDirection={orderBy === column.field ? order : false}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Yükleniyor...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                    >
                      {renderCellValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={pageSizes}
        component="div"
        count={processedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Sayfa başı:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / ${count}`
        }
      />
    </Paper>
  );
};

export default DataTable;
