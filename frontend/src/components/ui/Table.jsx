import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from './Loader';
import EmptyState from './EmptyState';
import Button from './Button';
import './Table.css';

export const Table = ({
  columns = [],
  data = [],
  loading = false,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  emptyAction,
  emptyIcon,
  onRowClick,
  stickyHeader = false,
  pagination = false,
  pageSize = 10,
  className = '',
  wrapperClassName = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isTableLoading = loading || isLoading;

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  // Pagination logic
  const totalItems = safeData.length;
  const totalPages = pagination ? Math.ceil(totalItems / pageSize) || 1 : 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const displayData = pagination && !isTableLoading
    ? safeData.slice((validPage - 1) * pageSize, validPage * pageSize)
    : safeData;

  const startItem = totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endItem = Math.min(validPage * pageSize, totalItems);

  return (
    <div className={`df-table-wrapper ${wrapperClassName}`}>
      <div className="df-table-container">
        <table className={`df-table ${stickyHeader ? 'df-table--sticky-header' : ''} ${className}`}>
          <thead>
            <tr>
              {safeColumns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'left',
                  }}
                  className="df-table__th"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isTableLoading ? (
              Array.from({ length: pageSize > 6 ? 6 : pageSize }).map((_, rIdx) => (
                <tr key={`loading-row-${rIdx}`} className="df-table__tr-loading">
                  {safeColumns.map((col, cIdx) => (
                    <td key={`loading-cell-${cIdx}`} className="df-table__td">
                      <Skeleton height="18px" width={cIdx === 0 ? '60%' : '80%'} />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData && displayData.length > 0 ? (
              displayData.map((row, rIdx) => {
                const isClickable = Boolean(onRowClick);
                const actualIndex = (validPage - 1) * pageSize + rIdx;

                return (
                  <tr
                    key={row.id || row._id || rIdx}
                    className={`df-table__tr ${isClickable ? 'df-table__tr--clickable' : ''}`}
                    onClick={() => onRowClick && onRowClick(row, actualIndex)}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(row, actualIndex);
                      }
                    }}
                  >
                    {safeColumns.map((col, cIdx) => {
                      const value = row[col.key];
                      const isNumeric = col.align === 'right' || col.numeric;

                      return (
                        <td
                          key={col.key || cIdx}
                          style={{ textAlign: col.align || 'left' }}
                          className={`df-table__td ${isNumeric ? 'table-num' : ''}`}
                        >
                          {col.render ? col.render(row[col.key], row, actualIndex) : (value ?? '—')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={safeColumns.length || 1} className="df-table__td-empty">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    icon={emptyIcon}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && !isTableLoading && totalItems > 0 && (
        <div className="df-table-pagination">
          <div className="df-table-pagination__info">
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
            <strong>{totalItems}</strong> records
          </div>
          <div className="df-table-pagination__controls">
            <Button
              variant="outline"
              size="sm"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              aria-label="Previous page"
              icon={ChevronLeft}
            />
            <span className="df-table-pagination__page-text">
              Page {validPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              aria-label="Next page"
              icon={ChevronRight}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
