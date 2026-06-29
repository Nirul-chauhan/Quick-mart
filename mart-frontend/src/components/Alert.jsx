import { IconAlert, IconCheck, IconInfo } from "./Icons";

export default function Alert({ type = "err", children }) {
  const map = {
    err:  { cls: "alert-err",  Icon: IconAlert },
    ok:   { cls: "alert-ok",   Icon: IconCheck },
    info: { cls: "alert-info", Icon: IconInfo },
    dev:  { cls: "alert-dev",  Icon: IconInfo },
  };
  const { cls, Icon } = map[type] || map.err;
  return (
    <div className={`alert ${cls}`}>
      <Icon size={15} />
      <span>{children}</span>
    </div>
  );
}
