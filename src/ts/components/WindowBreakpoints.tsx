import React from 'react';
import {DashComponentProps} from '../props';

type Props = {
    /**
     * Window widths on which to separate breakpoints, array of length N
     */
    widthBreakpointThresholdsPx?: number[],
    /**
     * Name of each width breakpoint, array of length N + 1
     */
    widthBreakpointNames?: string[],
    /**
     * Window heights on which to separate breakpoints, array of length N
     */
    heightBreakpointThresholdsPx?: number[],
    /**
     * Name of each height breakpoint, array of length N + 1
     */
    heightBreakpointNames?: string[],
    /**
     * Current width, NOTE: avoid using in a server callback
     */
    width?: number,
    /**
     * Current height, NOTE: avoid using in a server callback
     */
    height?: number,
    /**
     * Current width breakpoint
     */
    widthBreakpoint?: string,
    /**
     * Current height breakpoint
     */
    heightBreakpoint?: string,
} & DashComponentProps;

/**
 * Component description
 */
const WindowBreakpoints = (props: Props) => {
    const {
        id,
        setProps,
        widthBreakpointThresholdsPx,
        widthBreakpointNames,
        heightBreakpointThresholdsPx,
        heightBreakpointNames
    } = props;

    const widthBreakpointNames_ = widthBreakpointNames ?
        widthBreakpointNames :
        widthBreakpointThresholdsPx && [
            ...widthBreakpointThresholdsPx.map(px => `<=${px}px`),
            `>${widthBreakpointThresholdsPx.slice(-1)[0]}px`
        ]
    const heightBreakpointNames_ = heightBreakpointNames ?
        heightBreakpointNames :
        heightBreakpointThresholdsPx && [
            ...heightBreakpointThresholdsPx.map(px => `<=${px}px`),
            `>${heightBreakpointThresholdsPx.slice(-1)[0]}px`
        ]

    React.useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            const payload: Partial<Props> = {
                width: window.innerWidth,
                height: window.innerHeight,
            }
            // Find the width breakpoint name
            if (
                widthBreakpointThresholdsPx && widthBreakpointThresholdsPx.length > 0
                && widthBreakpointNames_ && widthBreakpointNames_.length === widthBreakpointThresholdsPx.length + 1
            ) {
                payload.widthBreakpoint = widthBreakpointNames_.filter(
                    (_, i) => payload.width <= [...widthBreakpointThresholdsPx, Infinity][i]
                )[0]
            }
            // Find the height breakpoint name
            if (
                heightBreakpointThresholdsPx && heightBreakpointThresholdsPx.length > 0
                && heightBreakpointNames_ && heightBreakpointNames_.length === heightBreakpointThresholdsPx.length + 1
            ) {
                payload.heightBreakpoint = heightBreakpointNames_.filter(
                    (_, i) => payload.height <= [...heightBreakpointThresholdsPx, Infinity][i]
                )[0]
            }
            // Set window width/height to state
            setProps(payload)
        }

        // Add event listener
        window.addEventListener("resize", handleResize)
        // Call handler right away so state gets updated with initial window size
        handleResize()

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize)
    }, [widthBreakpointThresholdsPx, widthBreakpointNames_, heightBreakpointThresholdsPx, heightBreakpointNames_])

    return null
}

WindowBreakpoints.defaultProps = {};

export default WindowBreakpoints;
