import { IconBlinkit } from "./Icons";

export default function Logo({ noMargin = false }) {
  return (
    <div className="logo" style={noMargin ? { marginBottom: 0 } : {}}>
      <div className="logo-mark">
        <IconBlinkit />
      </div>
      <span className="logo-name">Blinkit</span>
    </div>
  );
}
