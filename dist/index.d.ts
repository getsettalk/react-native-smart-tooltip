import React from 'react';
import type { ViewStyle, StyleProp, TextStyle } from 'react-native';
export interface TooltipProps {
    /** The text to display inside the tooltip bubble. */
    content: string;
    /** The component that triggers the tooltip when pressed. */
    children: React.ReactNode;
    /** Background color of the tooltip bubble. @default "#333333" */
    backgroundColor?: string;
    /** Text color inside the tooltip. @default "#FFFFFF" */
    textColor?: string;
    /** Text alignment. @default "left" */
    textAlign?: 'left' | 'center' | 'right';
    /** Additional styling for the tooltip container */
    containerStyle?: StyleProp<ViewStyle>;
    /** Additional styling for the text */
    textStyle?: StyleProp<TextStyle>;
    /** Border radius of the tooltip. @default 8 */
    borderRadius?: number;
    /** Tooltip max width. @default 280 */
    maxWidth?: number;
}
declare const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
//# sourceMappingURL=index.d.ts.map