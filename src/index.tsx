import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Modal,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    Text,
} from 'react-native';

import type { ViewStyle, StyleProp, TextStyle } from 'react-native';



const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    backgroundColor = '#333333',
    textColor = '#FFFFFF',
    textAlign = 'left',
    containerStyle,
    textStyle,
    borderRadius = 8,
    maxWidth = 280,
}) => {
    const triggerRef = useRef<View>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

    const animValue = useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
            setCoords({ x, y, width, height });
            setTooltipSize({ width: 0, height: 0 });
            animValue.setValue(0);
            setIsVisible(true);
        });
    };

    const closeTooltip = () => {
        Animated.timing(animValue, {
            toValue: 0,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => setIsVisible(false));
    };

    const isMeasured = tooltipSize.width > 0 && tooltipSize.height > 0;

    useEffect(() => {
        if (isMeasured) {
            Animated.spring(animValue, {
                toValue: 1,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
            }).start();
        }
    }, [isMeasured]);

    const tooltipMargin = 12;
    const pointerSize = 8;

    let tooltipLeft = 0;
    let tooltipTop = 0;
    let pointerLeft = 0;
    let showTop = true;

    if (isMeasured) {
        const triggerCenterX = coords.x + coords.width / 2;
        tooltipLeft = triggerCenterX - tooltipSize.width / 2;

        if (tooltipLeft < tooltipMargin) {
            tooltipLeft = tooltipMargin;
        } else if (tooltipLeft + tooltipSize.width > SCREEN_WIDTH - tooltipMargin) {
            tooltipLeft = SCREEN_WIDTH - tooltipSize.width - tooltipMargin;
        }

        pointerLeft = triggerCenterX - tooltipLeft - pointerSize;

        const minPointerX = borderRadius;
        const maxPointerX = tooltipSize.width - borderRadius - pointerSize * 2;

        if (pointerLeft < minPointerX) pointerLeft = minPointerX;
        if (pointerLeft > maxPointerX) pointerLeft = maxPointerX;

        const spaceAbove = coords.y;
        showTop = spaceAbove > tooltipSize.height + tooltipMargin + 40;

        if (showTop) {
            tooltipTop = coords.y - tooltipSize.height - pointerSize - 4;
        } else {
            tooltipTop = coords.y + coords.height + pointerSize + 4;
        }
    }

    return (
        <>
            <Pressable ref={triggerRef} onPress={handlePress} collapsable={false}>
                {children}
            </Pressable>

            <Modal visible={isVisible} transparent animationType="none">
                <Pressable style={styles.overlay} onPress={closeTooltip}>
                    {!isMeasured ? (
                        <View
                            onLayout={(e) => {
                                setTooltipSize({
                                    width: e.nativeEvent.layout.width,
                                    height: e.nativeEvent.layout.height,
                                });
                            }}
                            style={[
                                styles.tooltipContainer,
                                {
                                    backgroundColor,
                                    borderRadius,
                                    top: -1000,
                                    left: 0,
                                    opacity: 0,
                                    maxWidth: Math.min(maxWidth, SCREEN_WIDTH - tooltipMargin * 2),
                                },
                                containerStyle,
                            ]}
                        >
                            <Text style={[styles.tooltipText, { color: textColor, textAlign }, textStyle]}>
                                {content}
                            </Text>
                        </View>
                    ) : (
                        <Animated.View
                            style={[
                                styles.tooltipContainer,
                                {
                                    backgroundColor,
                                    borderRadius,
                                    top: tooltipTop,
                                    left: tooltipLeft,
                                    maxWidth: Math.min(maxWidth, SCREEN_WIDTH - tooltipMargin * 2),
                                    opacity: animValue,
                                    transform: [
                                        {
                                            scale: animValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1],
                                            }),
                                        },
                                    ],
                                },
                                containerStyle,
                            ]}
                        >
                            <Text style={[styles.tooltipText, { color: textColor, textAlign }, textStyle]}>
                                {content}
                            </Text>

                            <View
                                style={[
                                    styles.triangle,
                                    showTop ? styles.triangleBottom : styles.triangleTop,
                                    {
                                        borderLeftWidth: pointerSize,
                                        borderRightWidth: pointerSize,
                                        borderTopWidth: showTop ? pointerSize : 0,
                                        borderBottomWidth: !showTop ? pointerSize : 0,
                                        borderTopColor: showTop ? backgroundColor : 'transparent',
                                        borderBottomColor: !showTop ? backgroundColor : 'transparent',
                                        left: pointerLeft,
                                    },
                                ]}
                            />
                        </Animated.View>
                    )}
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    tooltipContainer: {
        position: 'absolute',
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
    },
    tooltipText: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '500',
    },
    triangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    triangleBottom: {
        bottom: -8,
    },
    triangleTop: {
        top: -8,
    },
});

export default Tooltip;