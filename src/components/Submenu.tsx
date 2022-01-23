import React, { ReactNode, useEffect, useRef, useState } from 'react';
import cx from 'clsx';

import {
  InternalProps,
  BooleanPredicate,
  HandlerParamsEvent,
  ItemParams,
} from '../types';
import { RefTrackerProvider, useRefTrackerContext } from './RefTrackerProvider';
import { useRefTracker } from '../hooks';
import { STYLE, NOOP } from '../constants';
import { cloneItems, getPredicateValue } from './utils';

export interface SubMenuProps
  extends InternalProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'hidden' | 'onClick'> {
  /**
   * Any valid node that can be rendered
   */
  label: ReactNode;

  /**
   * Any valid node that can be rendered
   */
  children: ReactNode;

  /**
   * Render a custom arrow
   */
  arrow?: ReactNode;

  /**
   * Disable the `Submenu`. If a function is used, a boolean must be returned
   */
  disabled?: BooleanPredicate;

  /**
   * Hide the `Submenu` and his children. If a function is used, a boolean must be returned
   */
  hidden?: BooleanPredicate;

  /**
   * Callback when the `Item` is clicked.
   *
   * @param event The event that occured on the Item node
   * @param props The props passed when you called `show(e, {props: yourProps})`
   * @param data The data defined on the `Item`
   * @param triggerEvent The event that triggered the context menu
   *
   * ```
   * function handleItemClick({ triggerEvent, event, props, data }: ItemParams<type of props, type of data>){
   *    // retrieve the id of the Item or any other dom attribute
   *    const id = e.currentTarget.id;
   *
   *    // access the props and the data
   *    console.log(props, data);
   *
   *    // access the coordinate of the mouse when the menu has been displayed
   *    const {  clientX, clientY } = triggerEvent;
   *
   * }
   *
   * <Item id="item-id" onClick={handleItemClick} data={{key: 'value'}}>Something</Item>
   * ```
   */
  onClick?: (args: ItemParams) => void;
}

interface SubMenuState {
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
}

export const Submenu: React.FC<SubMenuProps> = ({
  arrow = '▶',
  children,
  disabled = false,
  hidden = false,
  label,
  className,
  triggerEvent,
  propsFromTrigger,
  style,
  onClick = NOOP,
  ...rest
}) => {
  const menuRefTracker = useRefTrackerContext();
  const refTracker = useRefTracker();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SubMenuState>({
    left: '100%',
    top: 0,
    bottom: 'initial',
  });
  const handlerParams = {
    triggerEvent: triggerEvent as HandlerParamsEvent,
    props: propsFromTrigger,
  };
  const isDisabled = getPredicateValue(disabled, handlerParams);
  const isHidden = getPredicateValue(hidden, handlerParams);

  useEffect(() => {
    if (nodeRef.current) {
      const { innerWidth, innerHeight } = window;
      const rect = nodeRef.current.getBoundingClientRect();
      const style: SubMenuState = {};

      if (rect.right < innerWidth) {
        style.left = '100%';
        style.right = undefined;
      } else {
        style.right = '100%';
        style.left = undefined;
      }

      if (rect.bottom > innerHeight) {
        style.bottom = 0;
        style.top = 'initial';
      } else {
        style.bottom = 'initial';
      }

      setPosition(style);
    }
  }, []);

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    (handlerParams as ItemParams).event = e;
    isDisabled ? e.stopPropagation() : onClick(handlerParams as ItemParams);
  }

  function trackRef(node: HTMLElement | null) {
    if (node && !isDisabled)
      menuRefTracker.set(node, {
        node,
        isSubmenu: true,
        submenuRefTracker: refTracker,
      });
  }

  if (isHidden) return null;

  const cssClasses = cx(STYLE.item, className, {
    [`${STYLE.itemDisabled}`]: isDisabled,
  });

  const submenuStyle = {
    ...style,
    ...position,
  };

  return (
    <RefTrackerProvider refTracker={refTracker}>
      <div
        {...rest}
        className={cssClasses}
        ref={trackRef}
        tabIndex={-1}
        role="menuitem"
        aria-haspopup
        aria-disabled={isDisabled}
      >
        <div className={STYLE.itemContent} onClick={handleClick}>
          {label}
          <span className={STYLE.submenuArrow}>{arrow}</span>
        </div>
        <div className={STYLE.submenu} ref={nodeRef} style={submenuStyle}>
          {cloneItems(children, {
            propsFromTrigger,
            // injected by the parent
            triggerEvent: triggerEvent!,
          })}
        </div>
      </div>
    </RefTrackerProvider>
  );
};
