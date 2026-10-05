import { Component, type ReactNode } from "react";

export class ToolBoundary extends Component<
  { children: ReactNode; label: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="tool-fallback" role="alert">
          {this.props.label}
        </p>
      );
    }
    return this.props.children;
  }
}
