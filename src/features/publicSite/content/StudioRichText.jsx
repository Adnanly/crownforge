function formatFlags(format) {
  return {
    bold: Boolean(format & 1),
    italic: Boolean(format & 2),
    strikethrough: Boolean(format & 4),
    underline: Boolean(format & 8),
    code: Boolean(format & 16),
  };
}

function InlineNodes({ nodes }) {
  if (!Array.isArray(nodes)) return null;

  return nodes.map((node, index) => {
    if (!node) return null;
    if (node.type === "linebreak") {
      return <br key={index} />;
    }
    if (node.type === "link") {
      const href = node.fields?.url || node.url || "";
      const newTab = node.fields?.newTab;
      return (
        <a
          key={index}
          href={href}
          className="text-ggg-accent underline underline-offset-4"
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <InlineNodes nodes={node.children} />
        </a>
      );
    }
    if (node.type === "text") {
      const flags = formatFlags(node.format || 0);
      let content = node.text;
      if (flags.code) content = <code>{content}</code>;
      if (flags.bold) content = <strong>{content}</strong>;
      if (flags.italic) content = <em>{content}</em>;
      if (flags.underline) content = <u>{content}</u>;
      if (flags.strikethrough) content = <s>{content}</s>;
      return <span key={index}>{content}</span>;
    }
    return <InlineNodes key={index} nodes={node.children} />;
  });
}

function BlockNode({ node, index }) {
  if (!node) return null;
  const children = node.children;

  switch (node.type) {
    case "heading": {
      const Tag = ["h2", "h3", "h4"].includes(node.tag) ? node.tag : "h2";
      return (
        <Tag key={index} className="mt-8 font-bebas text-3xl uppercase tracking-[0.04em] text-ggg-text">
          <InlineNodes nodes={children} />
        </Tag>
      );
    }
    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
        <ListTag key={index} className="my-5 list-disc space-y-2 pl-5 text-ggg-body leading-[1.7] text-ggg-muted">
          {(children || []).map((item, itemIndex) => (
            <li key={itemIndex}>
              <InlineNodes nodes={item.children} />
            </li>
          ))}
        </ListTag>
      );
    }
    case "quote":
      return (
        <blockquote
          key={index}
          className="my-6 border-l-2 border-ggg-accent pl-4 text-ggg-body leading-[1.7] text-ggg-muted"
        >
          <InlineNodes nodes={children} />
        </blockquote>
      );
    case "paragraph":
    default:
      return (
        <p key={index} className="my-4 text-ggg-body leading-[1.75] text-ggg-muted">
          <InlineNodes nodes={children} />
        </p>
      );
  }
}

export default function StudioRichText({ content }) {
  const blocks = content?.root?.children;
  if (!Array.isArray(blocks) || !blocks.length) return null;

  return (
    <div className="max-w-[720px]">
      {blocks.map((node, index) => (
        <BlockNode key={index} node={node} index={index} />
      ))}
    </div>
  );
}
