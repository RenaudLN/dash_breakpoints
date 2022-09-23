import dash_breakpoints
from dash import Dash, html, clientside_callback, Input, Output, State

app = Dash(__name__)

app.layout = html.Div(
    [
        html.Div(id="display"),
        dash_breakpoints.WindowBreakpoints(
            id="breakpoints",
            widthBreakpointThresholdsPx=[800, 1200],
            widthBreakpointNames=["sm", "md", "lg"],
        ),
    ]
)

clientside_callback(
    """(wBreakpoint, w) => {
        console.log("Only updating when crossing the threshold")
        return `Breakpoint name: ${wBreakpoint}, width: ${w}px`
    }""",
    Output("display", "children"),
    Input("breakpoints", "widthBreakpoint"),
    State("breakpoints", "width"),
)


if __name__ == '__main__':
    app.run_server(debug=True)
