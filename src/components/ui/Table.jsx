"use client"

import { useState } from "react"
import "./styles/table.css"

const Table = ({ columns, data, actions, className = "", showActions = true }) => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleDropdownToggle = (rowIndex) => {
    setOpenDropdown(openDropdown === rowIndex ? null : rowIndex)
  }

  const handleClickOutside = (e) => {
    if (!e.target.closest(".action-menu")) {
      setOpenDropdown(null)
    }
  }

  // Add click outside listener
  useState(() => {
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className={`table-wrapper ${className}`}>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className || ""}>
                  {column.header}
                </th>
              ))}
              {showActions && actions && actions.length > 0 && <th className="actions-column">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ""}>
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
                {showActions && actions && actions.length > 0 && (
                  <td className="actions-cell">
                    <div className="action-menu">
                      <button
                        className="action-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDropdownToggle(rowIndex)
                        }}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>

                      {openDropdown === rowIndex && (
                        <div className="action-dropdown">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              className={`dropdown-item ${action.className || ""} ${action.disabled && action.disabled(row) ? "disabled" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!action.disabled || !action.disabled(row)) {
                                  action.onClick(row, rowIndex)
                                  setOpenDropdown(null)
                                }
                              }}
                              disabled={action.disabled && action.disabled(row)}
                            >
                              {action.icon && <span className="action-icon">{action.icon}</span>}
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
