import CopyButton from '../components/CopyButton';
import DownloadPDFButton from '../components/DownloadPDFButton';

export default function DocOutput({ type, html, text }) {
  return (
    <div className="doc-output">
      <div className="doc-toolbar">
        <div className="doc-toolbar-left">
          <span className="doc-type-badge">{type}</span>
        </div>
        <div className="doc-toolbar-right">
          <CopyButton getText={() => text} />
          <DownloadPDFButton getContent={() => html} filename={`${type.toLowerCase().replace(/\s/g, '-')}.html`} />
        </div>
      </div>
      <div
        className="doc-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
