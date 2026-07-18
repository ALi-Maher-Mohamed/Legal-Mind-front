import { dashPanel, dashPanelPad } from '../../lib/panelStyles';

type Props = {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
};

/** Reusable dashboard surface card */
export default function DashPanel({ children, className = '', padded = true }: Props) {
  return <div className={`${padded ? dashPanelPad : dashPanel} ${className}`}>{children}</div>;
}
