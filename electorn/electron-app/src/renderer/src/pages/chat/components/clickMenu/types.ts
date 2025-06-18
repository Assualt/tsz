import React from 'react'

export interface MenuItemInfo {
  key: string
  label?: JSX.Element | string
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void> | void
  icon?: JSX.Element | string
  disabled: () => Promise<boolean> | boolean
}
