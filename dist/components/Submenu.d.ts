import React, { ReactNode } from 'react';
import { InternalProps, BooleanPredicate, ItemParams } from '../types';
export interface SubMenuProps extends InternalProps, Omit<React.HTMLAttributes<HTMLElement>, 'hidden' | 'onClick'> {
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
export declare const Submenu: React.FC<SubMenuProps>;
